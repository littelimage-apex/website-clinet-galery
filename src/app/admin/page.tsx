import { createClient } from '@/lib/supabase/server'
import { ProjectsTable, AdminProject } from '@/components/admin/ProjectsTable'
import { StatsCards } from '@/components/admin/StatsCards'
import { ClientData } from '@/types/database'

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch all projects for admin overview
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  const rawProjects = projects || []

  // Transform to AdminProject format
  const adminProjects: AdminProject[] = rawProjects.map(project => {
    const rawClientData = project.client_data as unknown
    const clientData: ClientData = (rawClientData && typeof rawClientData === 'object' && 'selection_manifest' in rawClientData)
      ? rawClientData as ClientData
      : { selection_manifest: [], revision_history: [] }

    return {
      id: project.id,
      clientName: project.title, // Using title as client name - in production, join with users table
      childName: project.child_name,
      occasion: project.occasion,
      stage: project.current_stage,
      selectionCurrent: clientData.selection_manifest.length,
      selectionTotal: project.package_limit,
      status: project.status,
      lastUpdated: project.updated_at,
    }
  })

  // Calculate stats
  const stats = {
    total: rawProjects.length,
    stage1: rawProjects.filter(p => p.current_stage === 1).length,
    stage2: rawProjects.filter(p => p.current_stage === 2).length,
    stage3: rawProjects.filter(p => p.current_stage === 3).length,
    completedThisMonth: rawProjects.filter(p => {
      if (p.status !== 'completed') return false
      const updated = new Date(p.updated_at)
      const now = new Date()
      return updated.getMonth() === now.getMonth() && updated.getFullYear() === now.getFullYear()
    }).length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal-800 mb-2">
          Birds-Eye View
        </h1>
        <p className="text-charcoal-500">
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
        <h2 className="font-serif text-xl text-charcoal-800 mb-4">
          All Projects
        </h2>
        <ProjectsTable projects={adminProjects} />
      </div>
    </div>
  )
}
