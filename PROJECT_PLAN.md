# 每周分享博客系统设计方案

## 📚 项目背景

此仓库是 fork 自 [ruanyf/weekly](https://github.com/ruanyf/weekly) 项目，需要定期从原仓库同步以下文件（**只读，不要修改**）：

- `docs/` 目录：包含所有期刊的 Markdown 源文件
- `README.md` 文件：包含期刊的时间索引和目录结构

**重要提醒**：这两个文件是数据源，不要进行任何修改，所有自定义功能都通过其他方式实现。

**项目目标**：以体验更好的方式查看期刊内容，提供更友好的阅读界面、分类浏览、搜索功能和导航体验。

## 🎯 核心需求梳理

基于 `/docs` 目录下的 Markdown 源文件，项目设计方案如下：

### 1. 核心数据结构

- 解析每期 MD 文件生成结构化数据：
  - `${filePath}`: 文件路径
  - `${title}`: 期刊标题
  - `${publishDate}`: 发布日期
  - `${description}`: 简介摘要
  - `${tags}`: 二级标题自动提取为标签
  - `${content}`: 完整文章内容

- 时间索引数据结构（从 README.md 解析）：
  - `${year}`: 年份（二级标题，如 "## 2025"）
  - `${month}`: 月份（双星号加粗，如 "**八月**"）
  - `${issues}`: 期数列表（无序列表，如 "- 第 362 期：[标题](链接)"）

### 2. 基础功能实现

- **期刊浏览视图**：
  - 按 `${year}` 分类展示期刊列表
  - 每期显示 `${title}`、`${description}`、`${publishDate}`
  - 点击进入详情页保持原 MD 排版，优化阅读体验
  - 自动生成 TOC 菜单定位 `${tags}` 章节

### 3. 扩展功能

- **标签分类视图**：
  - 聚合所有 `${tags}` 形成分类导航
  - 每个标签下显示关联内容片段
  - 标注所属 `${title}` 并可跳转详情页
- **搜索功能**：
  - 集成 Algolia 实现全文检索
  - 支持按 `${title}`、`${tags}`、`${content}` 关键词搜索

### 4. 界面要求

- 极简设计风格
- 响应式布局适配多设备
- 优化图片/链接预览效果
- 保持 MD 原生排版的美观性

## 🏗️ 技术架构设计

### 技术选型说明

#### 前端框架

- **Next.js 14+**: 选择 App Router 架构，支持静态导出部署，内置图片优化、字体优化等性能特性
- **React 18+**: 使用最新的 React 特性，包括 Suspense、Concurrent Features 等

#### UI 组件库

- **shadcn/ui**: 基于 Radix UI 的组件库，提供优秀的可访问性和定制性
- **Radix UI**: 无样式的可访问性组件，作为 shadcn/ui 的基础
- **Tailwind CSS**: 快速开发响应式界面，与 shadcn/ui 完美配合

#### Markdown 解析和渲染

- **gray-matter**: 解析 Markdown 文件的 frontmatter 部分
- **marked**: 高性能的 Markdown 解析器，支持 GFM 扩展
- **react-markdown**: React 组件形式的 Markdown 渲染器
- **rehype-highlight**: 代码高亮插件，支持多种编程语言
- **rehype-autolink-headings**: 自动为标题添加锚点链接
- **rehype-slug**: 为标题生成 slug，支持 TOC 导航

#### 样式和动效

- **Tailwind CSS**: 原子化 CSS 框架，快速构建响应式界面
- **Motion**: 成熟的 React 动画库，提供流畅的页面过渡和组件动效
- **@tailwindcss/typography**: 优化 Markdown 内容的排版样式
- **@tailwindcss/aspect-ratio**: 响应式宽高比组件

#### 状态管理和工具

- **Zustand**: 轻量级状态管理，用于全局状态如搜索状态、主题状态
- **Zod**: TypeScript 优先的 schema 验证库，用于数据验证

#### 代码质量和开发体验

- **@antfu/eslint-config**: 统一的代码风格，提升开发体验和代码质量
- **Prettier**: 代码格式化工具，与 ESLint 配合使用
- **TypeScript**: 严格的类型检查，提升代码质量和开发体验
- **Husky**: Git hooks 管理，确保代码质量

#### 搜索和索引

- **Algolia DocSearch**: 专业的文档搜索服务，支持中文搜索
- **@algolia/autocomplete-js**: Algolia 的自动完成组件
- **@algolia/autocomplete-theme-classic**: 经典主题样式

#### 部署和性能

- **Vercel**: 推荐部署平台，与 Next.js 完美集成
- **@next/bundle-analyzer**: 包大小分析工具
- **next-pwa**: PWA 支持，提升移动端体验

### 第一阶段：最小可用版本（MVP）

```typescript
// 核心数据结构
interface Issue {
  filePath: string         // 文件路径，如 "docs/issue-2.md"
  title: string            // 期刊标题，如 "每周分享第 2 期"
  publishDate: string      // 发布日期
  description: string      // 简介摘要
  tags: Tag[]              // 二级标题自动提取为标签
  content: string          // 完整文章内容
  year: number             // 年份，用于分类
}

interface Tag {
  name: string             // 标签名称，如 "新闻", "教程", "文摘"
  slug: string             // 标签标识，如 "news", "tutorials", "digest"
  count: number            // 该标签下的文章数量
  relatedIssues: Issue[]   // 关联的期刊列表
}

// 时间索引数据结构（从 README.md 解析）
interface TimeIndex {
  year: number             // 年份，如 2025
  months: MonthIndex[]     // 月份索引列表
}

interface MonthIndex {
  month: string            // 月份名称，如 "八月"
  monthNumber: number      // 月份数字，如 8
  issues: IssueIndex[]     // 期数索引列表
}

interface IssueIndex {
  number: number           // 期数，如 362
  title: string           // 期刊标题
  filePath: string        // 文件路径
}
```

### 页面结构

```bash
app/
├── page.tsx                    # 首页：按年分类展示
├── issues/
│   ├── page.tsx               # 期数列表页
│   └── [id]/
│       └── page.tsx           # 期数详情页（+ TOC）
└── tags/
    ├── page.tsx               # 标签概览页
    └── [slug]/
        └── page.tsx           # 标签详情页
```

## 📅 分阶段实施计划

### 第一阶段：基础功能

**目标**：实现最基本的期数浏览和阅读功能

1. **数据解析器**
   - 扫描 `docs/` 目录下的 `issue-*.md` 文件（**只读数据源**）
   - 解析期刊标题、发布日期、简介摘要
   - 提取二级标题作为标签
   - 生成结构化数据，保持原 Markdown 内容完整性
   - 解析 `README.md` 文件（**只读数据源**），构建时间索引结构

2. **核心页面**
   - 首页：通过 README.md 时间索引按年/月分组显示期刊列表，每期显示标题、简介、发布日期
   - 期刊详情页：完整内容 + TOC 菜单定位标签章节
   - 期刊列表页：所有期刊的简单列表

3. **基础组件**
   - 期刊卡片组件（显示标题、简介、发布日期、标签）
   - TOC 组件（自动生成标签章节导航）
   - 基础布局组件（响应式设计）
   - ✅ 搜索弹窗组件（Algolia 集成）🚀
   - 基于 shadcn/ui 的通用组件（Button、Card、Input 等）

## 📊 第一阶段完成状态

### ✅ 已完成功能
- [x] 期刊卡片组件（显示标题、简介、发布日期、标签）
- [x] TOC 组件（自动生成标签章节导航）
- [x] 基础布局组件（响应式设计）
- [x] 搜索弹窗组件（Algolia 集成）
- [x] 基于 shadcn/ui 的通用组件（Button、Card、Input 等）

### 🎯 核心页面状态
- [x] 首页：通过 README.md 时间索引按年/月分组显示期刊列表
- [x] 期刊详情页：完整内容 + TOC 菜单定位标签章节
- [x] 期刊列表页：所有期刊的简单列表

**第一阶段基础功能已全部完成！** 🎉

---

### 第二阶段：标签系统

**目标**：实现按标签分类浏览

1. **标签页面**
   - 标签概览页：显示所有标签及文章数量
   - 标签详情页：显示该标签下的所有内容片段，标注所属期刊标题并可跳转详情页

2. **标签组件**
   - 标签云组件
   - 标签筛选组件
   - 搜索弹窗组件（全局搜索功能）
   - 基于 shadcn/ui 的 Badge、Tag 等组件

### 第三阶段：搜索集成

**目标**：集成 Algolia 搜索弹窗

1. **Algolia 配置**
   - 设置索引结构
   - 配置搜索参数
   - 实现搜索弹窗组件

2. **搜索弹窗功能**
   - 全局搜索按钮触发弹窗
   - 搜索结果实时展示（支持按标题、标签、内容关键词搜索）
   - 高亮匹配内容
   - 点击结果直接跳转到对应页面

### 第四阶段：体验优化

**目标**：提升阅读体验和界面美观

1. **阅读体验优化**
   - 优化 Markdown 渲染样式，保持原生排版美观性
   - 改进 TOC 导航体验，精确定位标签章节
   - 优化图片/链接预览效果
   - 使用 shadcn/ui 的 Typography 组件优化文字排版

2. **界面美化**
   - 优化响应式设计，完美适配多设备
   - 完善深浅色主题，支持系统主题切换
   - 基于 Tailwind CSS 的响应式断点和动画系统

3. **动效交互实现** ⭐ **新增重点**
   - **页面过渡动效**：使用 Framer Motion 实现页面进入/退出动效
   - **组件交互动效**：卡片悬停、按钮点击、标签切换等微交互
   - **列表动效**：列表项错落进入、图片渐进加载等视觉层次
   - **搜索弹窗动效**：弹窗展开/收起、背景遮罩等模态框动效
   - **性能优化动效**：懒加载动画、滚动进度指示器等性能考虑

### 第五阶段：自动化同步

**目标**：建立 GitHub 仓库自动同步机制

1. **GitHub Actions 自动同步**
   - 创建定时同步工作流（如每天凌晨2点执行）
   - 自动从原仓库 `ruanyf/weekly` 拉取最新内容
   - 同步 `docs/` 目录和 `README.md` 文件
   - 自动提交同步结果到当前仓库

2. **同步脚本开发**
   - 开发 Python/Shell 同步脚本
   - 实现增量同步，只更新变更的文件
   - 添加同步日志和错误处理
   - 支持手动触发同步操作

3. **同步监控和通知**
   - 同步成功/失败通知（GitHub Issues 或邮件）
   - 同步日志记录和查看
   - 同步状态监控面板
   - 异常情况自动重试机制

## ⚙️ 技术实现要点

### 1. 数据解析

#### 1.1 核心解析器架构

**ContentParser 类接口**

```typescript
interface Issue {
  id: string
  title: string
  publishDate: Date
  description: string
  tags: string[]
  content: string
  fileName: string
  year: number
  month: number
  issueNumber: number
}

interface TimeIndex {
  [year: number]: {
    [month: number]: Issue[]
  }
}

class ContentParser {
  /**
   * 扫描并解析所有期刊文件，返回 Issue[] 数组
   */
  async scanIssues(): Promise<Issue[]>
  
  /**
   * 解析 README.md 构建时间索引结构
   */
  async parseTimeIndex(): Promise<TimeIndex>
  
  /**
   * 解析单个期刊文件，提取标题、日期、描述、标签等
   */
  async parseIssueFile(filePath: string): Promise<Issue>
  
  /**
   * 从 Markdown 内容中提取二级标题作为标签
   */
  extractTags(content: string): string[]
  
  /**
   * 生成简介摘要，去除 Markdown 标记
   */
  generateDescription(content: string, maxLength?: number): string
  
  /**
   * 提取发布日期，支持多种日期格式
   */
  extractPublishDate(content: string, fileName: string): Date
  
  /**
   * 提取期刊标题，优先从内容获取，备选从文件名生成
   */
  extractTitle(content: string, fileName: string): string
}
```

**核心功能**

- 自动扫描 `docs/` 目录下的 `issue-*.md` 文件
- 解析 Markdown 内容，提取结构化数据
- 构建时间索引，支持按年/月分组
- 智能标签提取，排除无意义标签
- 多格式日期识别和解析

#### 1.2 数据验证和错误处理

**DataValidator 类接口**

```typescript
interface ValidationError {
  field: string
  message: string
  code: string
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

class DataValidator {
  /**
   * 验证期刊数据完整性
   */
  validateIssue(issue: Issue): ValidationResult
  
  /**
   * 验证时间索引数据有效性
   */
  validateTimeIndex(timeIndex: TimeIndex): ValidationResult
  
  /**
   * 日期格式验证
   */
  isValidDate(date: any): boolean
}
```

**验证规则**

- 期刊标题、内容、标签等必填字段检查
- 年份、月份、期数等数值范围验证
- 日期格式有效性验证
- 详细的错误信息收集和返回

#### 1.3 缓存和性能优化

**DataCache 类接口**

```typescript
interface CacheOptions {
  ttl?: number // 过期时间（毫秒）
  maxSize?: number // 最大缓存条目数
}

class DataCache<T> {
  private static instance: DataCache<any>
  
  /**
   * 单例模式获取缓存实例
   */
  static getInstance<T>(): DataCache<T>
  
  /**
   * 获取缓存数据，支持泛型类型
   */
  get(key: string): T | null
  
  /**
   * 设置缓存数据，支持 TTL 过期时间
   */
  set(key: string, value: T, options?: CacheOptions): void
  
  /**
   * 清理所有缓存数据
   */
  clear(): void
}

class CachedContentParser extends ContentParser {
  private cache: DataCache<Issue[]>
  
  constructor() {
    super()
    this.cache = DataCache.getInstance<Issue[]>()
  }
  
  // 继承 ContentParser，自动应用缓存策略
  // 期刊列表和时间索引的智能缓存
  // 5分钟缓存过期，平衡性能和实时性
}
```

### 2. 页面生成策略

**静态生成策略**

```typescript
interface PageGenerationConfig {
  staticPages: {
    issueDetails: boolean // 期数详情页: 预生成所有期刊的详情页面
    tagPages: boolean // 标签页面: 预生成所有标签的分类页面
    dynamicPages: boolean // 首页和列表页: 动态生成，支持实时数据更新
  }
  performance: {
    buildTimeOptimization: boolean // 只生成必要的静态页面，减少构建时间
    incrementalUpdate: boolean // 动态页面支持增量更新和缓存
    balanceStrategy: 'static' | 'dynamic' | 'hybrid' // 平衡静态生成和动态渲染的性能
  }
}
```

### 3. Algolia 搜索弹窗集成

**搜索数据结构接口**

```typescript
interface SearchRecord {
  objectID: string
  title: string
  description: string
  tags: string[]
  content: string
  publishDate: string
  fileName: string
  year: number
  month: number
  issueNumber: number
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
  searchResults: SearchRecord[]
  isLoading: boolean
}

interface AlgoliaConfig {
  searchableAttributes: string[] // 可搜索属性
  filterableAttributes: string[] // 筛选属性
  ranking: string[] // 排序规则
}
```

**核心功能**

- 支持按标题、标签、描述、内容进行全文搜索
- 标签和日期筛选功能
- 搜索结果高亮和直接跳转
- 全局搜索按钮触发弹窗

### 4. 动效交互实现

#### 4.1 页面过渡动效接口

```typescript
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
}

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

interface AnimatePresenceProps {
  children: React.ReactNode
  mode?: 'wait' | 'sync' | 'popLayout'
}
```

#### 4.2 组件交互动效接口

```typescript
interface IssueCardProps {
  issue: Issue
  className?: string
  onClick?: (issue: Issue) => void
  onHover?: (isHovered: boolean) => void
}

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

interface MotionDivProps {
  children: React.ReactNode
  className?: string
  initial?: any
  animate?: any
  exit?: any
  transition?: any
}
```

#### 4.3 列表和网格动效接口

```typescript
interface IssueListProps {
  issues: Issue[]
  className?: string
  layout?: 'grid' | 'list'
  staggerDelay?: number
}

interface ProgressiveImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
}

interface StaggeredListProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}
```

#### 4.4 搜索弹窗动效接口

```typescript
interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

interface ModalOverlayProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

interface ModalContentProps {
  children: React.ReactNode
  className?: string
  initial?: any
  animate?: any
  exit?: any
}
```

#### 4.5 性能优化动效接口

```typescript
interface LazyAnimateProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
}

interface ScrollProgressProps {
  className?: string
  color?: string
  height?: number
}

interface IntersectionObserverProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  onIntersect?: (isIntersecting: boolean) => void
}
```

## 🎨 界面设计原则

### 1. 极简设计风格

- 减少不必要的装饰元素
- 专注于内容本身
- 清晰的视觉层次
- 保持 Markdown 原生排版的美观性
- 使用 shadcn/ui 的设计系统，确保组件一致性

### 2. 阅读体验优化

- 合适的行高和字体大小
- 良好的对比度
- 舒适的留白
- 优化图片/链接预览效果
- 自动生成 TOC 菜单定位标签章节
- 使用 `@tailwindcss/typography` 优化 Markdown 渲染样式

### 3. 响应式导航

- 响应式布局适配多设备
- 面包屑导航
- 明确的返回路径
- 直观的标签分类导航
- 全局搜索按钮（触发搜索弹窗）

### 4. 动效交互体验

#### 页面过渡动效

- **Framer Motion**: 使用成熟的动画库实现流畅的页面切换
- **页面进入/退出**: 淡入淡出 + 轻微位移效果
- **路由切换**: 平滑的页面内容过渡，避免突兀的跳转
- **加载状态**: 优雅的骨架屏和加载动画

#### 组件交互动效

- **卡片悬停**: 微妙的阴影变化和轻微上浮效果
- **按钮点击**: 弹性缩放反馈，提升点击体验
- **标签切换**: 平滑的标签页切换动画
- **搜索弹窗**: 从中心展开的模态框动画

#### 列表和网格动效

- **列表项进入**: 错落的渐入动画，营造层次感
- **图片加载**: 渐进式图片加载，配合模糊到清晰的过渡
- **内容展开**: 手风琴式的展开/收起动画
- **无限滚动**: 新内容加载时的平滑过渡

#### 微交互细节

- **滚动指示器**: 页面滚动进度条动画
- **返回顶部**: 平滑的滚动到顶部动画
- **标签筛选**: 标签选中状态的视觉反馈
- **搜索高亮**: 搜索结果的高亮动画效果

### 5. 性能优化动效

- **Intersection Observer**: 实现元素进入视口时的动画触发
- **CSS Transform**: 优先使用 GPU 加速的变换属性
- **动画节流**: 避免过度动画影响性能
- **懒加载动画**: 只在需要时触发动画，减少初始加载负担

## 📊 预期效果

### 功能完整性

- ✅ 期刊浏览：通过 README.md 时间索引按年/月分类，清晰的时间线，显示标题、简介、发布日期
- ✅ 内容阅读：保持原 Markdown 排版，自动生成 TOC 菜单定位标签章节
- ✅ 标签分类：二级标题作为标签，支持分类浏览，标注所属期刊并可跳转
- ✅ 搜索功能：Algolia 搜索弹窗，支持按标题、标签、内容关键词搜索，点击结果直接跳转

## 🔄 后续扩展可能

1. **阅读进度跟踪**：记录用户阅读历史和进度
2. **阅读统计**：简单的访问量统计和热门内容分析

### 优先级排序

1. **高优先级**：README.md 时间索引解析（只读数据源）、期刊浏览、基础阅读体验、TOC 导航、搜索弹窗
2. **中优先级**：标签分类、响应式布局、动效交互系统
3. **低优先级**：界面美化、主题切换
4. **维护优先级**：GitHub Actions 自动同步、定期同步原仓库数据，确保内容最新

## 📋 项目检查清单

### 第一阶段完成标准

- [ ] 数据解析器能够正确解析 `docs/` 下的所有 `issue-*.md` 文件（只读数据源）
- [ ] 能够解析 `README.md` 文件（只读数据源），构建时间索引结构
- [ ] 首页按年/月分组显示期刊列表，包含标题、简介、发布日期
- [ ] 期刊详情页能够完整显示内容，保持原 Markdown 排版
- [ ] TOC 组件能够自动生成标签章节导航
- [ ] shadcn/ui 组件库配置完成，基础组件可用
- [ ] Tailwind CSS 样式系统正常工作

### 第二阶段完成标准

- [ ] 标签概览页显示所有标签及文章数量统计
- [ ] 标签详情页显示关联内容片段，标注所属期刊
- [ ] 支持从标签页面跳转到期刊详情页

### 第三阶段完成标准

- [ ] Algolia 搜索弹窗功能正常工作
- [ ] 全局搜索按钮能够触发搜索弹窗
- [ ] 支持按标题、标签、内容关键词搜索
- [ ] 搜索结果能够高亮匹配内容并直接跳转

### 第四阶段完成标准

- [ ] 响应式布局完美适配多设备
- [ ] 图片/链接预览效果优化
- [ ] 深浅色主题切换功能正常
- [ ] 整体界面简洁美观，阅读体验优秀
- [ ] 所有组件使用 shadcn/ui，保持设计一致性
- [ ] Tailwind CSS 样式系统完整，响应式断点正确
- [ ] **动效交互系统完整实现** ⭐ **新增重点**
  - [ ] 页面过渡动效：页面进入/退出、路由切换等流畅过渡
  - [ ] 组件交互动效：卡片悬停、按钮点击、标签切换等微交互
  - [ ] 列表动效：列表项错落进入、图片渐进加载等视觉层次
  - [ ] 搜索弹窗动效：弹窗展开/收起、背景遮罩等模态框动效
  - [ ] 性能优化动效：懒加载动画、滚动进度指示器等性能考虑
  - [ ] 使用 Framer Motion 实现所有动效，确保动画流畅自然

### 第五阶段完成标准

- [x] GitHub Actions 自动同步工作流配置完成（MVP版本）
- [x] 同步脚本能够正确执行增量同步（基础版本）
- [x] 自动同步定时执行（每天凌晨2点）
- [ ] 同步成功/失败通知机制正常
- [ ] 同步日志记录和查看功能可用
- [x] 支持手动触发同步操作（基础版本）

### 维护阶段完成标准

- [ ] 建立数据源文件只读保护机制，防止意外修改
- [x] 配置定期同步原仓库的自动化流程（MVP版本）
- [ ] 验证同步后的数据解析功能正常
- [ ] 建立数据源变更的监控和通知机制
