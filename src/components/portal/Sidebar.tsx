'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Project } from '@/types/database'
import { StageBadge } from './StageBadge'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

interface SidebarProps {
  projects: Project[]
  userName: string
  userEmail: string
}

export function Sidebar({ projects, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-72 h-screen bg-cream-50/90 backdrop-blur-md border-r border-sage-200/60 flex flex-col fixed left-0 top-0 z-50 shadow-soft">
      {/* Logo */}
      <div className="p-6 border-b border-sage-100">
        <Link href="/dashboard" className="block relative">
          <Logo className="w-32" />
        </Link>
      </div>

      {/* Projects List */}
      <nav className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xs font-semibold text-sage-400 uppercase tracking-wider mb-3 px-2">
          Your Sessions
        </h2>
        <ul className="space-y-1">
          {projects.length === 0 ? (
            <li className="px-3 py-4 text-center">
              <p className="text-sage-400 text-sm">
                No sessions yet
              </p>
            </li>
          ) : (
            projects.map((project) => {
              const isActive = pathname === `/project/${project.id}`
              return (
                <li key={project.id}>
                  <Link
                    href={`/project/${project.id}`}
                    className={`block px-3 py-3 rounded-xl transition-all duration-[400ms]
                              ${isActive
                        ? 'bg-white shadow-soft border border-sage-200'
                        : 'hover:bg-white/50'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`font-medium truncate text-sm
                                       ${isActive ? 'text-sage-700' : 'text-sage-700'}`}>
                        {project.child_name || project.title}
                      </span>
                    </div>
                    {project.occasion && (
                      <p className="text-xs text-sage-400 capitalize mb-2 truncate">
                        {project.occasion}
                      </p>
                    )}
                    <StageBadge stage={project.current_stage} size="sm" />
                  </Link>
                </li>
              )
            })
          )}
        </ul>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-sage-100 bg-cream-100/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center">
            <span className="text-sage-700 font-semibold text-sm">
              {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sage-700 truncate">
              {userName}
            </p>
            <p className="text-xs text-sage-400 truncate">
              {userEmail}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-sage-500 hover:text-sage-700
                     hover:bg-sage-50 rounded-lg transition-all duration-[400ms]
                     flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
