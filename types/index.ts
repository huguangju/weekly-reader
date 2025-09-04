// 核心数据结构
export interface Issue {
  id: string
  filePath: string
  title: string
  optimizedTitle: string
  publishDate: Date
  description: string
  coverImage?: string
  tags: string[]
  content: string
  fileName: string
  year: number
  month: number
  issueNumber: number
}

export interface Tag {
  name: string
  slug: string
  count: number
  relatedIssues: Issue[]
}

// 时间索引数据结构（从 README.md 解析）
export interface TimeIndex {
  year: number
  months: MonthIndex[]
}

export interface MonthIndex {
  month: string
  monthNumber: number
  issues: IssueIndex[]
}

export interface IssueIndex {
  number: number
  title: string
  filePath: string
}

// 数据验证相关类型
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// 缓存相关类型
export interface CacheOptions {
  ttl?: number // 过期时间（毫秒）
  maxSize?: number // 最大缓存条目数
}

// 页面生成配置
export interface PageGenerationConfig {
  staticPages: {
    issueDetails: boolean
    tagPages: boolean
    dynamicPages: boolean
  }
  performance: {
    buildTimeOptimization: boolean
    incrementalUpdate: boolean
    balanceStrategy: 'static' | 'dynamic' | 'hybrid'
  }
}
