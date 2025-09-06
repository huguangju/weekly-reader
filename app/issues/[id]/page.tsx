import { notFound } from 'next/navigation'
import { getIssueByNumber } from '@/lib/data'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { TOC } from '@/components/toc'
import Link from 'next/link'

interface IssuePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { id } = await params
  const issueNumber = parseInt(id)
  
  if (isNaN(issueNumber)) {
    notFound()
  }

  const issue = await getIssueByNumber(issueNumber)
  
  if (!issue) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
                首页
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/issues" className="hover:text-gray-900 dark:hover:text-gray-100">
                期刊列表
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 dark:text-gray-100">
              第 {issue.issueNumber} 期
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-3">
            {/* 期刊内容 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-lg">
              <MarkdownRenderer content={issue.content} optimizedTitle={issue.optimizedTitle} />
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* TOC 导航 */}
              <TOC />

              {/* 标签 */}
              {issue.tags.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {issue.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
