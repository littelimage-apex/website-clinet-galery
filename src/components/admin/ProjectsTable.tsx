'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Eye } from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import { STAGE_LABELS } from '@/types/database'

export interface AdminProject {
  id: string
  clientName: string
  childName: string | null
  occasion: string | null
  stage: number
  selectionCurrent: number
  selectionTotal: number
  status: string
  lastUpdated: string
}

type SortField = 'clientName' | 'stage' | 'status' | 'lastUpdated'
type SortDirection = 'asc' | 'desc'

interface ProjectsTableProps {
  projects: AdminProject[]
  onViewProject?: (projectId: string) => void
}

export function ProjectsTable({ projects, onViewProject }: ProjectsTableProps) {
  const [sortField, setSortField] = useState<SortField>('lastUpdated')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'clientName':
          comparison = a.clientName.localeCompare(b.clientName)
          break
        case 'stage':
          comparison = a.stage - b.stage
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [projects, sortField, sortDirection])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-3.5 h-3.5 text-charcoal-300" />
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-lavender-600" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-lavender-600" />
    )
  }

  const StageBadge = ({ stage }: { stage: number }) => {
    const stageConfig = {
      1: {
        bg: 'bg-lavender-100',
        text: 'text-lavender-700',
        border: 'border-lavender-200',
      },
      2: {
        bg: 'bg-[var(--champagne-400)]/30',
        text: 'text-charcoal-700',
        border: 'border-[var(--champagne-400)]',
      },
      3: {
        bg: 'bg-[var(--sage-400)]/30',
        text: 'text-charcoal-700',
        border: 'border-[var(--sage-400)]',
      },
    }

    const config = stageConfig[stage as keyof typeof stageConfig] || stageConfig[1]
    const label = STAGE_LABELS[stage as keyof typeof STAGE_LABELS] || 'Unknown'

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}
      >
        {label}
      </span>
    )
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      active: { bg: 'bg-lavender-100', text: 'text-lavender-700' },
      submitted: { bg: 'bg-blue-100', text: 'text-blue-700' },
      editing: { bg: 'bg-amber-100', text: 'text-amber-700' },
      ready_for_review: { bg: 'bg-[var(--sage-400)]/20', text: 'text-[var(--sage-500)]' },
      completed: { bg: 'bg-charcoal-100', text: 'text-charcoal-600' },
    }

    const config = statusConfig[status] || statusConfig.active
    const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide ${config.bg} ${config.text}`}
      >
        {displayStatus}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-lavender-100 overflow-hidden shadow-soft">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-lavender-50 border-b border-lavender-100">
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('clientName')}
                  className="flex items-center gap-1 text-xs font-semibold text-charcoal-600 uppercase tracking-wider hover:text-lavender-600 transition-colors"
                >
                  Client Name
                  <SortIcon field="clientName" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Child Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Occasion
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('stage')}
                  className="flex items-center gap-1 text-xs font-semibold text-charcoal-600 uppercase tracking-wider hover:text-lavender-600 transition-colors"
                >
                  Stage
                  <SortIcon field="stage" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Selection Progress
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 text-xs font-semibold text-charcoal-600 uppercase tracking-wider hover:text-lavender-600 transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center gap-1 text-xs font-semibold text-charcoal-600 uppercase tracking-wider hover:text-lavender-600 transition-colors"
                >
                  Last Updated
                  <SortIcon field="lastUpdated" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project, index) => (
              <tr
                key={project.id}
                className={`border-b border-lavender-50 hover:bg-lavender-50/50 transition-colors cursor-pointer ${
                  index % 2 === 1 ? 'bg-cream-50' : 'bg-white'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-charcoal-800">{project.clientName}</span>
                </td>
                <td className="px-4 py-3 text-charcoal-600">{project.childName || '-'}</td>
                <td className="px-4 py-3 text-charcoal-600">{project.occasion || '-'}</td>
                <td className="px-4 py-3">
                  <StageBadge stage={project.stage} />
                </td>
                <td className="px-4 py-3">
                  <div className="w-32">
                    <ProgressBar
                      current={project.selectionCurrent}
                      total={project.selectionTotal}
                      size="sm"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3 text-sm text-charcoal-500">
                  {formatDate(project.lastUpdated)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewProject?.(project.id)
                    }}
                    className="p-1.5 rounded-lg text-charcoal-400 hover:text-lavender-600 hover:bg-lavender-100 transition-all"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {sortedProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-charcoal-400">No projects found</p>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-charcoal-900/20 backdrop-blur-soft flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lifted animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-xl text-charcoal-800">
                  {selectedProject.clientName}
                </h3>
                {selectedProject.childName && (
                  <p className="text-charcoal-500 text-sm">{selectedProject.childName}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-charcoal-400 hover:text-charcoal-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-1">
                    Occasion
                  </p>
                  <p className="text-charcoal-700">{selectedProject.occasion || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-1">Status</p>
                  <StatusBadge status={selectedProject.status} />
                </div>
              </div>

              <div>
                <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-2">
                  Current Stage
                </p>
                <StageBadge stage={selectedProject.stage} />
              </div>

              <div>
                <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-2">
                  Selection Progress
                </p>
                <ProgressBar
                  current={selectedProject.selectionCurrent}
                  total={selectedProject.selectionTotal}
                />
              </div>

              <div>
                <p className="text-xs text-charcoal-400 uppercase tracking-wider mb-1">
                  Last Updated
                </p>
                <p className="text-charcoal-700">
                  {new Date(selectedProject.lastUpdated).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => onViewProject?.(selectedProject.id)}
                className="flex-1 btn btn-primary text-sm"
              >
                View Full Details
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="btn btn-secondary text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
