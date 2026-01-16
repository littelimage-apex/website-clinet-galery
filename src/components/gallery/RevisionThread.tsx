'use client'

import { RevisionItem } from '@/types/database'

interface ThreadMessage {
  id: string
  version: number
  filename: string
  comment: string
  sender: 'client' | 'editor'
  timestamp: string
  status?: 'pending' | 'approved' | 'rejected'
}

interface RevisionThreadProps {
  revisions: RevisionItem[]
  filename: string
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function parseRevisionsToThread(revisions: RevisionItem[], filename: string): ThreadMessage[] {
  const messages: ThreadMessage[] = []

  // Filter revisions for this specific filename
  const fileRevisions = revisions.filter(r => r.filename === filename)

  fileRevisions.forEach((revision, index) => {
    // Editor message - version upload
    messages.push({
      id: `editor-${revision.version}-${index}`,
      version: revision.version,
      filename: revision.filename,
      comment: `Uploaded version ${revision.version}`,
      sender: 'editor',
      timestamp: revision.created_at || new Date().toISOString(),
      status: revision.status
    })

    // Client message - if there's a comment
    if (revision.client_comment) {
      messages.push({
        id: `client-${revision.version}-${index}`,
        version: revision.version,
        filename: revision.filename,
        comment: revision.client_comment,
        sender: 'client',
        timestamp: revision.created_at || new Date().toISOString(),
        status: revision.status
      })
    }
  })

  return messages
}

export function RevisionThread({ revisions, filename }: RevisionThreadProps) {
  const messages = parseRevisionsToThread(revisions, filename)

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-charcoal-400">
        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">No revision history yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
          style={{
            animation: `fadeIn 400ms ease-out ${index * 50}ms forwards`,
            opacity: 0
          }}
        >
          <div
            className={`
              max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-[400ms]
              ${message.sender === 'client'
                ? 'bg-lavender-100 text-lavender-800 rounded-br-md'
                : 'bg-cream-200 text-charcoal-700 rounded-bl-md'}
            `}
          >
            {/* Sender label */}
            <div className={`
              text-xs font-medium mb-1
              ${message.sender === 'client' ? 'text-lavender-600' : 'text-charcoal-500'}
            `}>
              {message.sender === 'client' ? 'You' : 'Editor'}
              {message.sender === 'editor' && (
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-charcoal-100 text-charcoal-500">
                  v{message.version}
                </span>
              )}
            </div>

            {/* Message content */}
            <p className="text-sm leading-relaxed">{message.comment}</p>

            {/* Status badge for editor messages */}
            {message.sender === 'editor' && message.status && (
              <div className="mt-2">
                <StatusBadge status={message.status} />
              </div>
            )}

            {/* Timestamp */}
            <div className={`
              text-[10px] mt-2
              ${message.sender === 'client' ? 'text-lavender-400' : 'text-charcoal-400'}
            `}>
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected'
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      bg: 'bg-[var(--champagne-400)]',
      text: 'text-charcoal-700',
      label: 'Pending Review'
    },
    approved: {
      bg: 'bg-[var(--sage-400)]',
      text: 'text-white',
      label: 'Approved'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Revision Requested'
    }
  }

  const config = statusConfig[status]

  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium
      ${config.bg} ${config.text}
      transition-all duration-[400ms]
    `}>
      {status === 'approved' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status === 'rejected' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )}
      {status === 'pending' && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {config.label}
    </span>
  )
}

export { StatusBadge }
