import { ContentParser } from './content-parser'
import { Issue, TimeIndex } from '@/types'

const contentParser = new ContentParser()

/**
 * 获取所有期刊数据
 */
export async function getAllIssues(): Promise<Issue[]> {
  try {
    return await contentParser.scanIssues()
  } catch (error) {
    console.error('获取期刊数据失败:', error)
    return []
  }
}

/**
 * 获取时间索引数据
 */
export async function getTimeIndex(): Promise<TimeIndex[]> {
  try {
    return await contentParser.parseTimeIndex()
  } catch (error) {
    console.error('获取时间索引失败:', error)
    return []
  }
}

/**
 * 根据期数获取期刊详情
 */
export async function getIssueByNumber(issueNumber: number): Promise<Issue | null> {
  try {
    const issues = await getAllIssues()
    return issues.find(issue => issue.issueNumber === issueNumber) || null
  } catch (error) {
    console.error(`获取期刊 ${issueNumber} 失败:`, error)
    return null
  }
}

/**
 * 根据文件路径获取期刊详情
 */
export async function getIssueByPath(filePath: string): Promise<Issue | null> {
  try {
    const issues = await getAllIssues()
    return issues.find(issue => issue.filePath.includes(filePath)) || null
  } catch (error) {
    console.error(`根据路径获取期刊失败 ${filePath}:`, error)
    return null
  }
}

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const issues = await getAllIssues()
    const allTags = new Set<string>()
    
    issues.forEach(issue => {
      issue.tags.forEach(tag => allTags.add(tag))
    })
    
    return Array.from(allTags).sort()
  } catch (error) {
    console.error('获取标签失败:', error)
    return []
  }
}

/**
 * 根据标签获取相关期刊
 */
export async function getIssuesByTag(tag: string): Promise<Issue[]> {
  try {
    const issues = await getAllIssues()
    return issues.filter(issue => issue.tags.includes(tag))
  } catch (error) {
    console.error(`根据标签获取期刊失败 ${tag}:`, error)
    return []
  }
}

/**
 * 搜索期刊（标题、标签、内容）
 */
export async function searchIssues(query: string): Promise<Issue[]> {
  try {
    if (!query.trim()) return []
    
    const issues = await getAllIssues()
    const lowerQuery = query.toLowerCase()
    
    return issues.filter(issue => 
      issue.title.toLowerCase().includes(lowerQuery) ||
      issue.description.toLowerCase().includes(lowerQuery) ||
      issue.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      issue.content.toLowerCase().includes(lowerQuery)
    )
  } catch (error) {
    console.error('搜索期刊失败:', error)
    return []
  }
}
