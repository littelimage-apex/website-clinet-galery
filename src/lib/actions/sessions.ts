'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SelectionItem, SessionWithDetails } from '@/types/database'

// Json type for Supabase JSONB fields
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

interface ActionResult {
    success: boolean
    error?: string
}

/**
 * Update the selection manifest for a session
 */
export async function updateSelectionManifest(
    sessionId: string,
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
        // We strictly check if the session belongs to a client linked to the current user
        const { data: session, error: fetchError } = await supabase
            .from('sessions')
            .select('status, client_id, clients!inner(user_id)')
            .eq('id', sessionId)
            .eq('clients.user_id', user.id)
            .single()

        if (fetchError || !session) {
            return { success: false, error: 'Session not found' }
        }

        // Check if session is locked
        if (session.status === 'submitted' || session.status === 'editing') {
            return { success: false, error: 'Session is locked and cannot be modified' }
        }

        // Update the selection manifest
        const { error: updateError } = await supabase
            .from('sessions')
            .update({
                client_data: {
                    selection_manifest: selections,
                    revision_history: []
                } as unknown as Json
            })
            .eq('id', sessionId)

        // Note: RLS should handle permission checks, but the select above confirms ownership too

        if (updateError) {
            return { success: false, error: updateError.message }
        }

        revalidatePath(`/project/${sessionId}`) // Keeping the URL structure /project/:id for now or should I change to /session/:id? User didn't specify URL changes, so I'll keep /project/ for now to minimize disruption
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
    sessionId: string,
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
        const { data: session, error: fetchError } = await supabase
            .from('sessions')
            .select('status, package_limit, clients!inner(user_id)')
            .eq('id', sessionId)
            .eq('clients.user_id', user.id)
            .single()

        if (fetchError || !session) {
            return { success: false, error: 'Session not found' }
        }

        // Validate selection count
        if (selections.length === 0) {
            return { success: false, error: 'No images selected' }
        }

        if (session.package_limit && selections.length > session.package_limit) {
            return { success: false, error: `Cannot select more than ${session.package_limit} images` }
        }

        // Check if already submitted
        if (session.status !== 'active') {
            return { success: false, error: 'Selection has already been submitted' }
        }

        // Update session with selections and change status
        const { error: updateError } = await supabase
            .from('sessions')
            .update({
                client_data: {
                    selection_manifest: selections,
                    revision_history: []
                } as unknown as Json,
                status: 'submitted',
                current_stage: 2
            })
            .eq('id', sessionId)

        if (updateError) {
            return { success: false, error: updateError.message }
        }

        revalidatePath(`/project/${sessionId}`)
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('submitSelection error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

/**
 * Get session data with details
 */
export async function getSession(sessionId: string) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return { session: null, error: 'Not authenticated' }
        }

        const { data: session, error } = await supabase
            .from('sessions')
            .select(`
        *,
        clients!inner(*),
        occasions(*)
      `)
            .eq('id', sessionId)
            .eq('clients.user_id', user.id)
            .single()

        if (error) {
            return { session: null, error: error.message }
        }

        return { session: session as SessionWithDetails, error: null }
    } catch (error) {
        console.error('getSession error:', error)
        return { session: null, error: 'An unexpected error occurred' }
    }
}
