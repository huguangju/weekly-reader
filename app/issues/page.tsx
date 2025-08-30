import { getAllIssues } from '@/lib/data'
import { IssueCard } from '@/components/issue-card'
import Link from 'next/link'

export default async function IssuesPage() {
  const issues = await getAllIssues()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              ← 返回首页
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            所有期刊
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            共 {issues.length} 期期刊内容
          </p>
        </div>

        {/* 期刊网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
            />
          ))}
        </div>

        {/* 统计信息 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm px-8 py-6">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {issues.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                总期数
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {new Set(issues.flatMap(issue => issue.tags)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                标签分类
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.max(...issues.map(issue => issue.issueNumber))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                最新期数
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
