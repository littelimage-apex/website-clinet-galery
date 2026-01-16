import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/portal/ProjectCard'

export const metadata = {
  title: 'Dashboard | Little Image Photography',
  description: 'View and manage your photo sessions',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch user's projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('session_date', { ascending: false })

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
  }

  // Get user's first name for greeting
  const fullName = user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'there'
  const firstName = fullName.split(' ')[0]

  // Get current hour for time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-8 lg:p-12">
      {/* Welcome Header */}
      <header className="mb-12 max-w-4xl">
        <h1 className="font-serif text-4xl lg:text-5xl text-charcoal-900 mb-3 tracking-tight">
          {greeting}, <span className="text-lavender-600 block sm:inline">{firstName}.</span>
        </h1>
        <p className="text-charcoal-500 text-lg">
          Welcome back to your gallery. Here are your photo sessions.
        </p>
      </header>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-6">
            Your Sessions ({projects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-lavender-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-lavender-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-charcoal-700 mb-3">
              No sessions yet
            </h2>
            <p className="text-charcoal-400">
              Your photo sessions will appear here once they are ready.
              We will notify you when your gallery is prepared.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
