'use client'

import { memo, useMemo } from 'react'
import { Issue, TimeIndex } from '@/types'
import { IssueCard } from './issue-card'

interface SimpleIssueListProps {
  timeIndex: TimeIndex[]
  allIssues: Issue[]
  className?: string
}

export const SimpleIssueList = memo(function SimpleIssueList({
  timeIndex,
  allIssues,
  className = ''
}: SimpleIssueListProps) {
  // 创建期数到期刊的映射
  const issueMap = useMemo(() => {
    const map = new Map<number, Issue>()
    allIssues.forEach(issue => {
      map.set(issue.issueNumber, issue)
    })
    return map
  }, [allIssues])

  return (
    <div className={`space-y-12 ${className}`}>
      {timeIndex.map((yearData) => (
        <div key={yearData.year} className="space-y-6">
          {/* 年份标题 */}
          <div 
            data-year={yearData.year}
            className="border-b border-gray-200 dark:border-gray-700 pb-2"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {yearData.year}
            </h2>
          </div>

          {/* 月份分组 */}
          {yearData.months.map((monthData) => (
            <div 
              key={`${yearData.year}-${monthData.month}`} 
              data-month={`${yearData.year}-${monthData.month}`}
              className="space-y-4"
            >
              {/* 月份标题 */}
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {monthData.month}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {monthData.issues.length} 期
                </span>
              </div>

              {/* 期刊网格 - 使用懒加载 */}
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
  )
})
