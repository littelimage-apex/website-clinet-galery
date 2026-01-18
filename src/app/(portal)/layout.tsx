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

  // Fetch user's sessions for the sidebar
  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select(`
      *,
      occasions (*),
      clients!inner (*)
    `)
    .eq('clients.user_id', user.id)
    .order('created_at', { ascending: false })

  if (sessionsError) {
    console.error('Error fetching sessions:', sessionsError)
  }

  // Get user's display name from metadata or email
  const userName = user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Guest'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        sessions={sessions || []}
        userName={userName}
        userEmail={user.email || ''}
      />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
