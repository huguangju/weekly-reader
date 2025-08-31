import { NextRequest, NextResponse } from 'next/server'
import { ContentParser } from '@/lib/content-parser'

export async function GET(request: NextRequest) {
  try {
    const parser = new ContentParser()
    const issues = await parser.scanIssues()
    
    return NextResponse.json({
      success: true,
      issues: issues.map(issue => ({
        ...issue,
        publishDate: issue.publishDate.toISOString()
      }))
    })
  } catch (error) {
    console.error('获取期刊数据失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取期刊数据失败' 
      },
      { status: 500 }
    )
  }
}
