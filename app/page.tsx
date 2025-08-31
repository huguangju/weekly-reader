import { getTimeIndex, getAllIssues } from '@/lib/data'
import { IssueCard } from '@/components/issue-card'
import { Issue } from '@/types'

export default async function HomePage() {
  const timeIndex = await getTimeIndex()
  const allIssues = await getAllIssues()

  // 创建期数到期刊的映射
  const issueMap = new Map<number, Issue>()
  allIssues.forEach(issue => {
    issueMap.set(issue.issueNumber, issue)
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            科技爱好者周刊
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mx-auto">
            记录每周值得分享的科技内容，周五发布。这里提供更友好的阅读界面和分类浏览体验。
          </p>
        </div>

        {/* 期刊列表 */}
        <div className="space-y-12">
          {timeIndex.map((yearData) => (
            <div key={yearData.year} className="space-y-6">
              {/* 年份标题 */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {yearData.year}
                </h2>
              </div>

              {/* 月份分组 */}
              {yearData.months.map((monthData) => (
                <div key={`${yearData.year}-${monthData.month}`} className="space-y-4">
                  {/* 月份标题 */}
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {monthData.month}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {monthData.issues.length} 期
                    </span>
                  </div>

                  {/* 期刊网格 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthData.issues.map((issueIndex) => {
                      const issue = issueMap.get(issueIndex.number)
                      if (!issue) return null
                      
                      return (
                        <IssueCard
                          key={issue.id}
                          issue={issue}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm px-8 py-6">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {allIssues.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                总期数
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {timeIndex.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                年份
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(allIssues.flatMap(issue => issue.tags)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                标签分类
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
