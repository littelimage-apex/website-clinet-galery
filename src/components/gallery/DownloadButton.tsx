'use client'

import { useState } from 'react'
import { Download, Loader2, Check } from 'lucide-react'

interface DownloadButtonProps {
  url: string
  filename?: string
  variant?: 'primary' | 'icon'
  label?: string
  className?: string
  disabled?: boolean
}

export function DownloadButton({
  url,
  filename,
  variant = 'primary',
  label = 'Download All',
  className = '',
  disabled = false
}: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleDownload = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)

    try {
      // Fetch the file
      const response = await fetch(url)
      const blob = await response.blob()

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || extractFilename(url)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      // Show success state briefly
      setIsComplete(true)
      setTimeout(() => setIsComplete(false), 2000)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Extract filename from URL if not provided
  const extractFilename = (url: string): string => {
    try {
      const pathname = new URL(url).pathname
      return pathname.split('/').pop() || 'download'
    } catch {
      return 'download'
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleDownload}
        disabled={disabled || isLoading}
        className={`
          group relative p-2.5 rounded-xl
          bg-white/90 backdrop-blur-sm
          border border-[var(--sage-400)]/30
          text-[var(--sage-500)]
          transition-all duration-300 ease-out
          hover:bg-[var(--sage-500)] hover:text-white hover:border-[var(--sage-500)]
          hover:shadow-lg hover:shadow-[var(--sage-500)]/20
          hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          disabled:hover:bg-white/90 disabled:hover:text-[var(--sage-500)]
          ${className}
        `}
        title={isLoading ? 'Preparing download...' : 'Download image'}
        aria-label={isLoading ? 'Preparing download' : `Download ${filename || 'image'}`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isComplete ? (
          <Check className="w-5 h-5" />
        ) : (
          <Download className="w-5 h-5" />
        )}
      </button>
    )
  }

  // Primary variant - large download all button
  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-3
        px-8 py-4 text-lg font-semibold
        bg-[var(--sage-500)] text-white
        rounded-2xl
        transition-all duration-300 ease-out
        hover:bg-[var(--sage-400)] hover:shadow-xl hover:shadow-[var(--sage-500)]/25
        hover:-translate-y-0.5
        active:translate-y-0 active:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:translate-y-0 disabled:hover:shadow-none
        disabled:hover:bg-[var(--sage-500)]
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Preparing Download...</span>
        </>
      ) : isComplete ? (
        <>
          <Check className="w-6 h-6" />
          <span>Download Started!</span>
        </>
      ) : (
        <>
          <Download className="w-6 h-6" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}

interface DownloadAllButtonProps {
  urls: string[]
  archiveName?: string
  className?: string
  disabled?: boolean
}

export function DownloadAllButton({
  urls,
  archiveName = 'photos.zip',
  className = '',
  disabled = false
}: DownloadAllButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const handleDownloadAll = async () => {
    if (disabled || isLoading || urls.length === 0) return

    setIsLoading(true)
    setProgress(0)

    try {
      // Dynamically import JSZip only when needed
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      // Download each file and add to zip
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i]
        const response = await fetch(url)
        const blob = await response.blob()

        // Extract filename from URL
        const filename = url.split('/').pop() || `photo-${i + 1}.jpg`
        zip.file(filename, blob)

        setProgress(Math.round(((i + 1) / urls.length) * 100))
      }

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' })
      const downloadUrl = window.URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = archiveName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      setIsComplete(true)
      setTimeout(() => {
        setIsComplete(false)
        setProgress(0)
      }, 2000)
    } catch (error) {
      console.error('Download all failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownloadAll}
      disabled={disabled || isLoading || urls.length === 0}
      className={`
        inline-flex items-center justify-center gap-3
        px-10 py-5 text-xl font-semibold
        bg-[var(--sage-500)] text-white
        rounded-3xl
        transition-all duration-300 ease-out
        hover:bg-[var(--sage-400)] hover:shadow-2xl hover:shadow-[var(--sage-500)]/30
        hover:-translate-y-1
        active:translate-y-0 active:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:translate-y-0 disabled:hover:shadow-none
        disabled:hover:bg-[var(--sage-500)]
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-7 h-7 animate-spin" />
          <span>Preparing... {progress}%</span>
        </>
      ) : isComplete ? (
        <>
          <Check className="w-7 h-7" />
          <span>Download Started!</span>
        </>
      ) : (
        <>
          <Download className="w-7 h-7" />
          <span>Download All Photos</span>
        </>
      )}
    </button>
  )
}
