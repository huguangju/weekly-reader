import { NextRequest, NextResponse } from 'next/server'
import { adminClient, ALGOLIA_CONFIG } from '@/lib/algolia'
import { ContentParser } from '@/lib/content-parser'

export async function POST(request: NextRequest) {
  try {
    // 检查管理员权限（这里可以添加更严格的验证）
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '需要管理员权限' },
        { status: 401 }
      )
    }

    // 获取所有期刊数据
    const parser = new ContentParser()
    const issues = await parser.scanIssues()

    // 准备Algolia索引数据
    const algoliaObjects = issues.map(issue => ({
      objectID: issue.id,
      id: issue.id,
      title: issue.title,
      description: issue.description,
      tags: issue.tags,
      year: issue.year,
      month: issue.month,
      issueNumber: issue.issueNumber,
      fileName: issue.fileName,
      content: issue.content,
      publishDate: issue.publishDate.toISOString()
    }))

    // 批量索引数据 - 使用 v5 API
    const { taskID } = await adminClient.saveObject({
      indexName: ALGOLIA_CONFIG.indexName,
      body: algoliaObjects
    })

    // 等待索引完成
    await adminClient.waitForTask({
      indexName: ALGOLIA_CONFIG.indexName,
      taskID
    })

    const result = { objectIDs: algoliaObjects.map(obj => obj.objectID) }

    return NextResponse.json({
      success: true,
      message: `成功索引 ${result.objectIDs.length} 个期刊`,
      indexedCount: result.objectIDs.length,
      objectIDs: result.objectIDs
    })
  } catch (error) {
    console.error('Algolia索引失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '索引失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 简化版本 - 只返回基本信息
    return NextResponse.json({
      success: true,
      indexName: ALGOLIA_CONFIG.indexName,
      message: '索引信息获取成功'
    })
  } catch (error) {
    console.error('获取Algolia索引信息失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取索引信息失败' 
      },
      { status: 500 }
    )
  }
}
