'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SelectionItem } from '@/types/database'
import { Json } from '@/types/supabase'

interface ActionResult {
  success: boolean
  error?: string
}

/**
 * Update the selection manifest for a project
 */
export async function updateSelectionManifest(
  projectId: string,
  selections: SelectionItem[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify ownership and get current data
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('status, user_id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !project) {
      return { success: false, error: 'Project not found' }
    }

    // Check if project is locked
    if (project.status === 'submitted' || project.status === 'editing') {
      return { success: false, error: 'Project is locked and cannot be modified' }
    }

    // Update the selection manifest
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        client_data: {
          selection_manifest: selections,
          revision_history: []
        }
      })
      .eq('id', projectId)
      .eq('user_id', user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath(`/project/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error('updateSelectionManifest error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Submit the selection and move to stage 2
 */
export async function submitSelection(
  projectId: string,
  selections: SelectionItem[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify ownership
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('status, package_limit, user_id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !project) {
      return { success: false, error: 'Project not found' }
    }

    // Validate selection count
    if (selections.length === 0) {
      return { success: false, error: 'No images selected' }
    }

    if (selections.length > project.package_limit) {
      return { success: false, error: `Cannot select more than ${project.package_limit} images` }
    }

    // Check if already submitted
    if (project.status !== 'active') {
      return { success: false, error: 'Selection has already been submitted' }
    }

    // Update project with selections and change status
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        client_data: {
          selection_manifest: selections,
          revision_history: []
        },
        status: 'submitted',
        current_stage: 2
      })
      .eq('id', projectId)
      .eq('user_id', user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath(`/project/${projectId}`)
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('submitSelection error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get project data (for client components that need fresh data)
 */
export async function getProject(projectId: string) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { project: null, error: 'Not authenticated' }
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      return { project: null, error: error.message }
    }

    return { project, error: null }
  } catch (error) {
    console.error('getProject error:', error)
    return { project: null, error: 'An unexpected error occurred' }
  }
}
