import { createClient } from '@/lib/supabase/server'
import { ProjectsTable, AdminProject } from '@/components/admin/ProjectsTable'
import { StatsCards } from '@/components/admin/StatsCards'
import { ClientData } from '@/types/database'

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch all sessions for admin overview
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(`
      *,
      occasions (name),
      clients (full_name, email)
    `)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  const rawSessions = sessions || []

  // Transform to AdminProject format
  const adminProjects: AdminProject[] = rawSessions.map(session => {
    const rawClientData = session.client_data as unknown
    const clientData: ClientData = (rawClientData && typeof rawClientData === 'object' && 'selection_manifest' in rawClientData)
      ? rawClientData as ClientData
      : { selection_manifest: [], revision_history: [] }

    return {
      id: session.id,
      clientName: session.clients?.full_name || 'Unknown Client',
      childName: session.child_name,
      occasion: session.occasions?.name || 'Session',
      stage: session.current_stage || 1,
      selectionCurrent: clientData.selection_manifest.length,
      selectionTotal: session.package_limit || 0,
      status: (session.status as AdminProject['status']) || 'active',
      lastUpdated: session.updated_at || new Date().toISOString(),
    }
  })

  // Calculate stats
  const stats = {
    total: rawSessions.length,
    stage1: rawSessions.filter(p => p.current_stage === 1).length,
    stage2: rawSessions.filter(p => p.current_stage === 2).length,
    stage3: rawSessions.filter(p => p.current_stage === 3).length,
    completedThisMonth: rawSessions.filter(p => {
      if (p.status !== 'completed') return false
      const updated = new Date(p.updated_at || '')
      const now = new Date()
      return updated.getMonth() === now.getMonth() && updated.getFullYear() === now.getFullYear()
    }).length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-sage-800 mb-2">
          Birds-Eye View
        </h1>
        <p className="text-sage-500">
          Overview of all client projects and their current status
        </p>
      </div>

      <StatsCards
        totalActive={stats.total}
        inSelection={stats.stage1}
        inEditing={stats.stage2}
        readyToDeliver={stats.stage3}
        completedThisMonth={stats.completedThisMonth}
      />

      <div className="mt-8">
        <h2 className="font-serif text-xl text-sage-800 mb-4">
          All Projects
        </h2>
        <ProjectsTable projects={adminProjects} />
      </div>
    </div>
  )
}
