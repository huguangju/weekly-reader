import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { Issue, TimeIndex, MonthIndex, IssueIndex } from '@/types'
import { DataValidator } from './validators'
import { DataCache } from './cache'

export class ContentParser {
  private cache: DataCache<Issue[]>
  private timeIndexCache: DataCache<TimeIndex[]>

  constructor() {
    this.cache = DataCache.getInstance<Issue[]>()
    this.timeIndexCache = DataCache.getInstance<TimeIndex[]>()
  }

  /**
   * 扫描并解析所有期刊文件，返回 Issue[] 数组
   */
  async scanIssues(): Promise<Issue[]> {
    const cacheKey = 'all-issues'
    
    // 检查缓存
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const docsDir = path.join(process.cwd(), 'docs')
      const files = fs.readdirSync(docsDir)
      
      // 过滤出 issue-*.md 文件
      const issueFiles = files.filter(file => 
        file.startsWith('issue-') && file.endsWith('.md')
      )

      const issues: Issue[] = []
      
      for (const file of issueFiles) {
        try {
          const issue = await this.parseIssueFile(path.join(docsDir, file))
          if (issue) {
            issues.push(issue)
          }
        } catch (error) {
          console.error(`解析文件 ${file} 失败:`, error)
        }
      }

      // 按期数排序
      issues.sort((a, b) => b.issueNumber - a.issueNumber)

      // 缓存结果
      this.cache.set(cacheKey, issues, { ttl: 5 * 60 * 1000 }) // 5分钟缓存

      return issues
    } catch (error) {
      console.error('扫描期刊文件失败:', error)
      throw error
    }
  }

  /**
   * 解析 README.md 构建时间索引结构
   */
  async parseTimeIndex(): Promise<TimeIndex[]> {
    const cacheKey = 'time-index'
    
    // 检查缓存
    const cached = this.timeIndexCache.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const readmePath = path.join(process.cwd(), 'README.md')
      const content = fs.readFileSync(readmePath, 'utf-8')
      
      const timeIndexes: TimeIndex[] = []
      const lines = content.split('\n')
      
      let currentYear: number | null = null
      let currentMonth: string | null = null
      let currentMonthNumber: number | null = null
      let currentIssues: IssueIndex[] = []
      
      for (const line of lines) {
        // 匹配年份标题 (## 2025)
        const yearMatch = line.match(/^## (\d{4})$/)
        if (yearMatch) {
          // 保存上一年的数据
          if (currentYear && currentMonth && currentMonthNumber !== null && currentIssues.length > 0) {
            this.addMonthToYear(timeIndexes, currentYear, currentMonth, currentMonthNumber, currentIssues)
          }
          
          currentYear = parseInt(yearMatch[1])
          currentMonth = null
          currentMonthNumber = null
          currentIssues = []
          continue
        }
        
        // 匹配月份标题 (**八月**)
        const monthMatch = line.match(/^\*\*([^星]+)\*\*$/)
        if (monthMatch && currentYear) {
          // 保存上一月的数据
          if (currentMonth && currentMonthNumber !== null && currentIssues.length > 0) {
            this.addMonthToYear(timeIndexes, currentYear, currentMonth, currentMonthNumber, currentIssues)
          }
          
          currentMonth = monthMatch[1]
          currentMonthNumber = this.parseMonthNumber(currentMonth)
          currentIssues = []
          continue
        }
        
        // 匹配期数 (- 第 362 期：[标题](链接))
        const issueMatch = line.match(/^- 第 (\d+) 期：\[([^\]]+)\]\(([^)]+)\)/)
        if (issueMatch && currentYear && currentMonth && currentMonthNumber !== null) {
          const issueNumber = parseInt(issueMatch[1])
          const title = issueMatch[2]
          const filePath = issueMatch[3]
          
          currentIssues.push({
            number: issueNumber,
            title,
            filePath
          })
        }
      }
      
      // 保存最后一月的数据
      if (currentYear && currentMonth && currentMonthNumber !== null && currentIssues.length > 0) {
        this.addMonthToYear(timeIndexes, currentYear, currentMonth, currentMonthNumber, currentIssues)
      }

      // 缓存结果
      this.timeIndexCache.set(cacheKey, timeIndexes, { ttl: 5 * 60 * 1000 }) // 5分钟缓存

      return timeIndexes
    } catch (error) {
      console.error('解析README.md失败:', error)
      throw error
    }
  }

  /**
   * 解析单个期刊文件，提取标题、日期、描述、标签等
   */
  async parseIssueFile(filePath: string): Promise<Issue | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const fileName = path.basename(filePath)
      
      // 提取期数
      const issueNumberMatch = fileName.match(/issue-(\d+)\.md/)
      if (!issueNumberMatch) {
        console.warn(`文件名格式不正确: ${fileName}`)
        return null
      }
      
      const issueNumber = parseInt(issueNumberMatch[1])
      
      // 解析 Markdown 内容
      const { data, content: markdownContent } = matter(content)
      
      // 提取标题
      const title = this.extractTitle(markdownContent, fileName)
      
      // 提取发布日期
      const publishDate = this.extractPublishDate(markdownContent, fileName)
      
      // 生成简介摘要
      const description = this.generateDescription(markdownContent)
      
      // 提取标签
      const tags = this.extractTags(markdownContent)
      
      // 提取年份和月份
      const { year, month } = this.extractYearMonth(publishDate)
      
      const issue: Issue = {
        id: `issue-${issueNumber}`,
        filePath,
        title,
        publishDate,
        description,
        tags,
        content: markdownContent,
        fileName,
        year,
        month,
        issueNumber
      }
      
      // 验证数据
      const validation = DataValidator.validateIssue(issue)
      if (!validation.isValid) {
        console.warn(`期刊数据验证失败 ${fileName}:`, validation.errors)
        return null
      }
      
      return issue
    } catch (error) {
      console.error(`解析期刊文件失败 ${filePath}:`, error)
      return null
    }
  }

  /**
   * 从 Markdown 内容中提取二级标题作为标签
   */
  private extractTags(content: string): string[] {
    const lines = content.split('\n')
    const tags: string[] = []
    
    for (const line of lines) {
      // 匹配二级标题 (## 标题)
      const match = line.match(/^## (.+)$/)
      if (match) {
        const tag = match[1].trim()
        // 过滤掉一些无意义的标签
        if (tag && 
            !tag.includes('封面图') && 
            !tag.includes('如何搜索') && 
            !tag.includes('投稿') &&
            !tag.includes('合作') &&
            !tag.includes('招聘') &&
            !tag.includes('讨论区')) {
          tags.push(tag)
        }
      }
    }
    
    return tags
  }

  /**
   * 生成简介摘要，去除 Markdown 标记
   */
  private generateDescription(content: string, maxLength: number = 200): string {
    // 去除 Markdown 标记
    let cleanContent = content
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '') // 去除图片
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 将链接转换为纯文本
      .replace(/[*_`~]/g, '') // 去除其他 Markdown 标记
      .replace(/\n+/g, ' ') // 将换行转换为空格
      .trim()
    
    // 截取指定长度
    if (cleanContent.length > maxLength) {
      cleanContent = cleanContent.substring(0, maxLength) + '...'
    }
    
    return cleanContent
  }

  /**
   * 提取发布日期，支持多种日期格式
   */
  private extractPublishDate(content: string, fileName: string): Date {
    // 尝试从文件名提取日期（issue-362.md -> 假设是2025年）
    const issueNumberMatch = fileName.match(/issue-(\d+)\.md/)
    if (issueNumberMatch) {
      const issueNumber = parseInt(issueNumberMatch[1])
      // 根据期数估算年份（这是一个简化的逻辑，实际应该从内容中提取）
      if (issueNumber >= 300) {
        return new Date(2025, 0, 1) // 2025年1月1日
      } else if (issueNumber >= 200) {
        return new Date(2024, 0, 1) // 2024年1月1日
      } else {
        return new Date(2023, 0, 1) // 2023年1月1日
      }
    }
    
    // 如果无法从文件名提取，返回当前日期
    return new Date()
  }

  /**
   * 提取期刊标题，优先从内容获取，备选从文件名生成
   */
  private extractTitle(content: string, fileName: string): string {
    const lines = content.split('\n')
    
    // 查找第一个非空行作为标题
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('!') && !trimmed.startsWith('[')) {
        // 去除 Markdown 标记
        return trimmed.replace(/^#+\s*/, '').trim()
      }
    }
    
    // 如果无法从内容提取，从文件名生成
    const issueNumberMatch = fileName.match(/issue-(\d+)\.md/)
    if (issueNumberMatch) {
      return `科技爱好者周刊（第 ${issueNumberMatch[1]} 期）`
    }
    
    return '科技爱好者周刊'
  }

  /**
   * 从发布日期提取年份和月份
   */
  private extractYearMonth(date: Date): { year: number; month: number } {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1 // getMonth() 返回 0-11
    }
  }

  /**
   * 解析月份名称转换为数字
   */
  private parseMonthNumber(monthName: string): number {
    const monthMap: { [key: string]: number } = {
      '一月': 1, '二月': 2, '三月': 3, '四月': 4,
      '五月': 5, '六月': 6, '七月': 7, '八月': 8,
      '九月': 9, '十月': 10, '十一月': 11, '十二月': 12
    }
    
    return monthMap[monthName] || 1
  }

  /**
   * 将月份数据添加到年份索引中
   */
  private addMonthToYear(
    timeIndexes: TimeIndex[], 
    year: number, 
    month: string, 
    monthNumber: number, 
    issues: IssueIndex[]
  ): void {
    let yearIndex = timeIndexes.find(y => y.year === year)
    
    if (!yearIndex) {
      yearIndex = { year, months: [] }
      timeIndexes.push(yearIndex)
    }
    
    yearIndex.months.push({
      month,
      monthNumber,
      issues: [...issues]
    })
    
    // 按月份排序
    yearIndex.months.sort((a, b) => b.monthNumber - a.monthNumber)
  }
}
