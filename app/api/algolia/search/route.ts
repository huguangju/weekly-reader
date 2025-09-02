import { NextRequest, NextResponse } from 'next/server'
import { searchClient, searchConfig } from '@/lib/algolia'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '0')
    const filters = searchParams.get('filters') || ''

    if (!query || query.trim() === '') {
      return NextResponse.json({
        success: false,
        error: '搜索查询不能为空'
      }, { status: 400 })
    }

    // 构建搜索参数
    const searchParams_algolia = {
      query: query.trim(),
      page,
      hitsPerPage: searchConfig.hitsPerPage,
      attributesToRetrieve: searchConfig.attributesToRetrieve,
      attributesToHighlight: searchConfig.attributesToHighlight,
      highlightPreTag: searchConfig.highlightPreTag,
      highlightPostTag: searchConfig.highlightPostTag,
      ...(filters && { filters })
    }

    // 执行Algolia搜索 - 使用 v5 API
    const { results } = await searchClient.search({
      requests: [{
        indexName: 'weekly-issues',
        query: searchParams_algolia.query,
        page: searchParams_algolia.page,
        hitsPerPage: searchParams_algolia.hitsPerPage,
        attributesToRetrieve: searchParams_algolia.attributesToRetrieve,
        attributesToHighlight: searchParams_algolia.attributesToHighlight,
        highlightPreTag: searchParams_algolia.highlightPreTag,
        highlightPostTag: searchParams_algolia.highlightPostTag,
        ...(filters && { filters })
      }]
    })

    const result = results[0] as any
    const { hits, nbHits, nbPages, page: currentPage } = result

    // 处理搜索结果
    const searchResults = hits.map((hit: any) => ({
      id: hit.id,
      title: hit.title,
      description: hit.description,
      tags: hit.tags || [],
      year: hit.year,
      month: hit.month,
      issueNumber: hit.issueNumber,
      fileName: hit.fileName,
      publishDate: hit.publishDate,
      highlight: {
        title: hit._highlightResult?.title?.value || hit.title,
        description: hit._highlightResult?.description?.value || hit.description,
        tags: hit._highlightResult?.tags?.map((tag: any) => tag.value) || hit.tags
      }
    }))

    return NextResponse.json({
      success: true,
      query: searchParams_algolia.query,
      results: searchResults,
      pagination: {
        currentPage,
        totalPages: nbPages,
        totalHits: nbHits,
        hitsPerPage: searchConfig.hitsPerPage
      }
    })
  } catch (error) {
    console.error('Algolia搜索失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '搜索失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}
