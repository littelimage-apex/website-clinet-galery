// Custom image loader for WebDAV/NextCloud images
// This handles the special requirements for loading images from NextCloud public shares

interface ImageLoaderParams {
  src: string
  width: number
  quality?: number
}

/**
 * Custom image loader for NextCloud WebDAV images
 * Handles authentication and proper URL formatting for public shares
 */
export function webdavImageLoader({ src, width, quality }: ImageLoaderParams): string {
  // If it's already a full URL (WebDAV share), return as-is with size params if supported
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // NextCloud public shares support preview sizing
    const url = new URL(src)

    // Check if it's a NextCloud public share URL
    if (src.includes('/s/') || src.includes('/index.php/s/')) {
      // Append preview parameters for NextCloud
      url.searchParams.set('x', width.toString())
      url.searchParams.set('y', Math.round(width * 0.75).toString()) // Maintain aspect ratio estimate
      url.searchParams.set('a', 'true') // Auto-crop
      return url.toString()
    }

    return src
  }

  // For local/relative paths, use default Next.js image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
}

/**
 * Generate placeholder blur data URL
 * Creates a simple lavender-tinted placeholder
 */
export function generateBlurPlaceholder(): string {
  // Small lavender-tinted placeholder (10x10 pixels)
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN88ODBfwYKACNFBYwAABHBBwFJqH2AAAAAAElFTkSuQmCC'
}

/**
 * Construct a NextCloud public share URL for images
 */
export function constructNextCloudUrl(
  baseUrl: string,
  shareToken: string,
  filename: string,
  type: 'preview' | 'download' = 'preview'
): string {
  const cleanBase = baseUrl.replace(/\/$/, '')

  if (type === 'preview') {
    return `${cleanBase}/index.php/s/${shareToken}/preview?file=${encodeURIComponent(filename)}`
  }

  return `${cleanBase}/index.php/s/${shareToken}/download?path=/&files=${encodeURIComponent(filename)}`
}

/**
 * Parse a NextCloud share URL to extract components
 */
export function parseNextCloudShareUrl(url: string): {
  baseUrl: string
  shareToken: string
} | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const shareIndex = pathParts.findIndex(part => part === 's')

    if (shareIndex !== -1 && pathParts[shareIndex + 1]) {
      return {
        baseUrl: `${urlObj.protocol}//${urlObj.host}`,
        shareToken: pathParts[shareIndex + 1],
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Fetch file list from a NextCloud public share via WebDAV
 * Returns array of filenames in the share
 */
export async function fetchWebDAVFileList(shareUrl: string): Promise<string[]> {
  const parsed = parseNextCloudShareUrl(shareUrl)
  if (!parsed) {
    throw new Error('Invalid NextCloud share URL')
  }

  const webdavUrl = `${parsed.baseUrl}/public.php/webdav/`

  try {
    const response = await fetch(webdavUrl, {
      method: 'PROPFIND',
      headers: {
        'Authorization': `Basic ${btoa(`${parsed.shareToken}:`)}`,
        'Depth': '1',
        'Content-Type': 'application/xml',
      },
      body: `<?xml version="1.0" encoding="UTF-8"?>
        <d:propfind xmlns:d="DAV:">
          <d:prop>
            <d:displayname/>
            <d:getcontenttype/>
          </d:prop>
        </d:propfind>`,
    })

    if (!response.ok) {
      throw new Error(`WebDAV request failed: ${response.status}`)
    }

    const text = await response.text()

    // Parse XML response to extract filenames
    // Simple regex-based extraction for image files
    const filenameMatches = text.match(/<d:displayname>([^<]+\.(jpg|jpeg|png|gif|webp))<\/d:displayname>/gi) || []

    return filenameMatches.map(match => {
      const nameMatch = match.match(/<d:displayname>([^<]+)<\/d:displayname>/i)
      return nameMatch ? nameMatch[1] : ''
    }).filter(Boolean)
  } catch (error) {
    console.error('Error fetching WebDAV file list:', error)
    return []
  }
}
