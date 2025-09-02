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
   * 解析单个期刊文件
   */
  private async parseIssueFile(filePath: string): Promise<Issue | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const fileName = path.basename(filePath)
      
      // 提取期数
      const issueNumberMatch = fileName.match(/issue-(\d+)\.md/)
      if (!issueNumberMatch) {
        console.warn(`无法从文件名提取期数: ${fileName}`)
        return null
      }
      const issueNumber = parseInt(issueNumberMatch[1])
      
      // 提取标题
      const title = this.extractTitle(content, fileName)
      
      // 提取发布日期
      const publishDate = this.extractPublishDate(content, fileName)
      
      // 提取描述
      const description = this.generateDescription(content)
      
      // 提取封面图
      const coverImage = this.extractCoverImage(content) || undefined
      
      // 提取标签
      const tags = this.extractTags(content)
      
      // 提取年份和月份（简化处理）
      const year = publishDate.getFullYear()
      const month = publishDate.getMonth() + 1
      
      const issue: Issue = {
        id: `issue-${issueNumber}`,
        filePath,
        title,
        publishDate,
        description,
        coverImage,
        tags,
        content,
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
   * 只提取封面图后的内容作为描述
   */
  private generateDescription(content: string, maxLength: number = 200): string {
    // 找到封面图的位置
    const coverImageIndex = content.indexOf('## 封面图')
    if (coverImageIndex === -1) {
      // 如果没有找到封面图，使用原来的逻辑
      return this.generateDescriptionFromFullContent(content, maxLength)
    }
    
    // 提取封面图后的内容
    const contentAfterCover = content.substring(coverImageIndex)
    
    // 找到封面图部分的结束位置（下一个二级标题）
    const lines = contentAfterCover.split('\n')
    let endIndex = contentAfterCover.length
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      // 跳过封面图标题行和图片行
      if (line === '## 封面图' || line.startsWith('![') || line.startsWith('![](https://')) {
        continue
      }
      // 如果遇到下一个二级标题，停止提取
      if (line.startsWith('## ') && line !== '## 封面图') {
        endIndex = contentAfterCover.indexOf(line)
        break
      }
    }
    
    // 提取封面图描述部分
    const coverDescription = contentAfterCover.substring(0, endIndex)
    
    // 去除 Markdown 标记
    let cleanContent = coverDescription
      .replace(/^#+\s*封面图\s*$/gm, '') // 去除封面图标题
      .replace(/^#+\s*/gm, '') // 去除标题标记（#、##、###等）
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '') // 去除图片
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 将链接转换为纯文本
      .replace(/[*_`~]/g, '') // 去除其他 Markdown 标记
      .replace(/\n+/g, ' ') // 将换行转换为空格
      .trim()
    
    // 如果封面图描述为空，则使用第一个正文段落
    if (!cleanContent) {
      return this.generateDescriptionFromFullContent(content, maxLength)
    }
    
    // 截取指定长度
    if (cleanContent.length > maxLength) {
      cleanContent = cleanContent.substring(0, maxLength) + '...'
    }
    
    return cleanContent
  }

  /**
   * 从完整内容生成描述（原来的逻辑）
   */
  private generateDescriptionFromFullContent(content: string, maxLength: number = 200): string {
    // 去除 Markdown 标记
    let cleanContent = content
      .replace(/^#+\s*/gm, '') // 去除标题标记（#、##、###等）
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
   * 提取封面图，从 Markdown 内容中提取
   */
  private extractCoverImage(content: string): string | null {
    const lines = content.split('\n')
    let foundCoverSection = false
    
    for (const line of lines) {
      // 检查是否进入封面图部分
      if (line.trim() === '## 封面图' || line.trim().includes('封面图')) {
        foundCoverSection = true
        continue
      }
      
      // 在封面图部分查找图片
      if (foundCoverSection) {
        // 匹配各种图片格式：![alt](url) 或 ![](url)
        const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
        if (match) {
          return match[2]
        }
        
        // 如果遇到下一个二级标题，停止查找
        if (line.trim().startsWith('## ') && !line.trim().includes('封面图')) {
          break
        }
      }
    }
    
    // 如果没有找到封面图部分，查找第一个图片
    if (!foundCoverSection) {
      for (const line of lines) {
        const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
        if (match) {
          return match[2]
        }
      }
    }
    
    return null
  }

  /**
   * 提取发布日期，从 README.md 文件中获取准确的日期信息
   */
  private extractPublishDate(content: string, fileName: string): Date {
    const issueNumberMatch = fileName.match(/issue-(\d+)\.md/)
    if (!issueNumberMatch) {
      return new Date()
    }
    
    const issueNumber = parseInt(issueNumberMatch[1])
    const dateInfo = this.getIssueDateFromReadme(issueNumber)
    
    if (dateInfo) {
      return new Date(dateInfo.year, dateInfo.month - 1, dateInfo.day)
    }
    
    // 如果无法从 README.md 获取，使用估算逻辑
    if (issueNumber >= 300) {
      return new Date(2025, 0, 1)
    } else if (issueNumber >= 200) {
      return new Date(2024, 0, 1)
    } else {
      return new Date(2023, 0, 1)
    }
  }

  /**
   * 从 README.md 文件中获取指定期数的日期信息
   */
  private getIssueDateFromReadme(issueNumber: number): { year: number; month: number; day: number } | null {
    try {
      const readmePath = path.join(process.cwd(), 'README.md')
      const content = fs.readFileSync(readmePath, 'utf-8')
      const lines = content.split('\n')
      
      let currentYear: number | null = null
      let currentMonth: number | null = null
      let currentMonthName: string | null = null
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        
        // 匹配年份标题 (## 2025)
        const yearMatch = line.match(/^## (\d{4})$/)
        if (yearMatch) {
          currentYear = parseInt(yearMatch[1])
          currentMonth = null
          currentMonthName = null
          continue
        }
        
        // 匹配月份标题 (**八月**)
        const monthMatch = line.match(/^\*\*([^星]+)\*\*$/)
        if (monthMatch && currentYear) {
          currentMonthName = monthMatch[1]
          currentMonth = this.parseMonthNumber(currentMonthName)
          continue
        }
        
        // 匹配期数 (- 第 362 期：[标题](链接))
        const issueMatch = line.match(/^- 第 (\d+) 期：/)
        if (issueMatch && currentYear && currentMonth) {
          const lineIssueNumber = parseInt(issueMatch[1])
          if (lineIssueNumber === issueNumber) {
            // 找到目标期数，返回日期信息
            // 由于 README.md 中没有具体日期，我们使用月份的第一天
            return {
              year: currentYear,
              month: currentMonth,
              day: 1
            }
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('从 README.md 获取日期信息失败:', error)
      return null
    }
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
