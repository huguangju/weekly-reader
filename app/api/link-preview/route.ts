import { NextRequest, NextResponse } from 'next/server'

interface LinkPreviewData {
  title?: string
  description?: string
  image?: string
  url: string
  domain?: string
}

// 简单的 HTML 解析函数
function parseHtml(html: string, url: string): LinkPreviewData {
  const domain = new URL(url).hostname
  
  // 提取 title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const title = titleMatch?.[1]?.trim() || ''

  // 提取 description
  const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
  const description = descriptionMatch?.[1]?.trim() || ''

  // 提取 og:title
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
  const ogTitle = ogTitleMatch?.[1]?.trim()

  // 提取 og:description
  const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)
  const ogDescription = ogDescriptionMatch?.[1]?.trim()

  // 提取 og:image
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)
  const ogImage = ogImageMatch?.[1]?.trim()

  // 提取 twitter:image
  const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i)
  const twitterImage = twitterImageMatch?.[1]?.trim()

  // 处理相对图片 URL
  const processImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return undefined
    
    try {
      // 如果是绝对 URL，直接返回
      if (imageUrl.startsWith('http')) {
        return imageUrl
      }
      
      // 如果是相对 URL，转换为绝对 URL
      if (imageUrl.startsWith('//')) {
        return `https:${imageUrl}`
      }
      
      if (imageUrl.startsWith('/')) {
        return `${new URL(url).origin}${imageUrl}`
      }
      
      return `${new URL(url).origin}/${imageUrl}`
    } catch {
      return undefined
    }
  }

  return {
    title: ogTitle || title,
    description: ogDescription || description,
    image: processImageUrl(ogImage || twitterImage),
    url,
    domain
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  // 验证 URL 格式
  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  // 只允许 http 和 https 协议
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are allowed' }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      signal: controller.signal,
      redirect: 'follow'
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to fetch URL: ${response.status} ${response.statusText}` 
      }, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return NextResponse.json({ 
        error: 'URL does not return HTML content' 
      }, { status: 400 })
    }

    const html = await response.text()
    const previewData = parseHtml(html, url)

    return NextResponse.json(previewData)
  } catch (error) {
    console.error('Link preview fetch error:', error)
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ 
        error: 'Request timeout' 
      }, { status: 408 })
    }

    return NextResponse.json({ 
      error: 'Failed to fetch link preview' 
    }, { status: 500 })
  }
}
