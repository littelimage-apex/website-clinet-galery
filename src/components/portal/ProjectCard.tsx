import Link from 'next/link'
import { SessionWithDetails } from '@/types/database'
import { StageBadge } from './StageBadge'

interface ProjectCardProps {
  project: SessionWithDetails
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Link
      href={`/project/${project.id}`}
      className="group block bg-white rounded-2xl p-6 border border-sage-200
                 shadow-soft hover:shadow-lifted transition-all duration-[400ms]
                 hover:-translate-y-1"
    >
      {/* Stage badge on its own row */}
      <div className="mb-3">
        <StageBadge stage={project.current_stage || 1} />
      </div>

      {/* Title and occasion */}
      <div className="mb-4">
        <h3 className="font-serif text-2xl font-medium text-sage-800 tracking-tight
                       group-hover:text-sage-700 transition-colors duration-[400ms]">
          {project.child_name || project.title}
        </h3>
        {project.occasions?.name && (
          <p className="text-sage-500 text-sm mt-1 capitalize whitespace-nowrap">
            {project.occasions.name}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-sage-400 text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span>{formatDate(project.session_date)}</span>
      </div>

      <div className="mt-4 pt-4 border-t border-sage-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-sage-400 uppercase tracking-wide">
            {project.package_limit || 0} photos in package
          </span>
          <span className="text-sage-500 group-hover:text-sage-600
                         text-sm font-medium flex items-center gap-1
                         transition-colors duration-[400ms]">
            View Gallery
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-[400ms]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
