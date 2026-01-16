'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { RevisionItem, ClientData } from '@/types/database'

// Json type for Supabase JSONB fields
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

interface ActionResult {
  success: boolean
  error?: string
}

/**
 * Add a revision comment to a specific image
 */
export async function addRevisionComment(
  projectId: string,
  filename: string,
  comment: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Get current project data
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('client_data')
      .eq('id', projectId)
      .single()

    if (fetchError || !project) {
      return { success: false, error: 'Project not found' }
    }

    const clientData = project.client_data as unknown as ClientData
    const revisionHistory = clientData.revision_history || []

    // Find the latest revision for this filename
    const fileRevisions = revisionHistory.filter(r => r.filename === filename)
    const latestRevision = fileRevisions.reduce<RevisionItem | null>(
      (latest, current) => {
        if (!latest || current.version > latest.version) {
          return current
        }
        return latest
      },
      null
    )

    if (!latestRevision) {
      return { success: false, error: 'No revision found for this image' }
    }

    // Update the revision history with the new comment
    const updatedHistory = revisionHistory.map(revision => {
      if (
        revision.filename === filename &&
        revision.version === latestRevision.version
      ) {
        return {
          ...revision,
          client_comment: comment
        }
      }
      return revision
    })

    // Update the project
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        client_data: {
          ...clientData,
          revision_history: updatedHistory
        } as unknown as Json,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    if (updateError) {
      return { success: false, error: 'Failed to add comment' }
    }

    revalidatePath(`/project/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Error adding revision comment:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Approve a specific image
 */
export async function approveImage(
  projectId: string,
  filename: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Get current project data
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('client_data')
      .eq('id', projectId)
      .single()

    if (fetchError || !project) {
      return { success: false, error: 'Project not found' }
    }

    const clientData = project.client_data as unknown as ClientData
    const revisionHistory = clientData.revision_history || []

    // Find the latest revision for this filename and mark as approved
    const fileRevisions = revisionHistory.filter(r => r.filename === filename)
    const latestVersion = Math.max(...fileRevisions.map(r => r.version), 0)

    const updatedHistory = revisionHistory.map(revision => {
      if (revision.filename === filename && revision.version === latestVersion) {
        return {
          ...revision,
          status: 'approved' as const
        }
      }
      return revision
    })

    // Update the project
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        client_data: {
          ...clientData,
          revision_history: updatedHistory
        } as unknown as Json,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    if (updateError) {
      return { success: false, error: 'Failed to approve image' }
    }

    revalidatePath(`/project/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Error approving image:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Request a revision for a specific image with feedback
 */
export async function requestRevision(
  projectId: string,
  filename: string,
  comment: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Get current project data
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('client_data')
      .eq('id', projectId)
      .single()

    if (fetchError || !project) {
      return { success: false, error: 'Project not found' }
    }

    const clientData = project.client_data as unknown as ClientData
    const revisionHistory = clientData.revision_history || []

    // Find the latest revision for this filename
    const fileRevisions = revisionHistory.filter(r => r.filename === filename)
    const latestVersion = Math.max(...fileRevisions.map(r => r.version), 0)

    // Update the revision history - mark as rejected and add comment
    const updatedHistory = revisionHistory.map(revision => {
      if (revision.filename === filename && revision.version === latestVersion) {
        return {
          ...revision,
          status: 'rejected' as const,
          client_comment: comment
        }
      }
      return revision
    })

    // Update the project
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        client_data: {
          ...clientData,
          revision_history: updatedHistory
        } as unknown as Json,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    if (updateError) {
      return { success: false, error: 'Failed to request revision' }
    }

    revalidatePath(`/project/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Error requesting revision:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Approve all images and move to Stage 3
 */
export async function approveAllImages(projectId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Get current project data
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('client_data, current_stage')
      .eq('id', projectId)
      .single()

    if (fetchError || !project) {
      return { success: false, error: 'Project not found' }
    }

    // Verify we're in Stage 2
    if (project.current_stage !== 2) {
      return { success: false, error: 'Project is not in review stage' }
    }

    const clientData = project.client_data as unknown as ClientData
    const revisionHistory = clientData.revision_history || []

    // Get unique filenames and their latest versions
    const latestByFilename = new Map<string, number>()
    revisionHistory.forEach(revision => {
      const existing = latestByFilename.get(revision.filename) || 0
      if (revision.version > existing) {
        latestByFilename.set(revision.filename, revision.version)
      }
    })

    // Check if all latest versions are approved
    let allApproved = true
    for (const [filename, version] of latestByFilename) {
      const latestRevision = revisionHistory.find(
        r => r.filename === filename && r.version === version
      )
      if (!latestRevision || latestRevision.status !== 'approved') {
        allApproved = false
        break
      }
    }

    if (!allApproved) {
      return { success: false, error: 'Not all images have been approved' }
    }

    // Update project to Stage 3
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        current_stage: 3,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    if (updateError) {
      return { success: false, error: 'Failed to advance to next stage' }
    }

    revalidatePath(`/project/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error('Error approving all images:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
