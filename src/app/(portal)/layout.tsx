import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/portal/Sidebar'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch user's projects for the sidebar
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
  }

  // Get user's display name from metadata or email
  const userName = user.user_metadata?.full_name ||
                   user.user_metadata?.name ||
                   user.email?.split('@')[0] ||
                   'Guest'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        projects={projects || []}
        userName={userName}
        userEmail={user.email || ''}
      />
      <main className="ml-72 min-h-screen">
        {children}
      </main>
    </div>
  )
}
