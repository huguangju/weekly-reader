'use client'

import { Issue } from '@/types'
import Link from 'next/link'
import { SummaryRenderer } from './summary-renderer'

interface IssueCardProps {
  issue: Issue
  className?: string
}

export function IssueCard({ issue, className = '' }: IssueCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
    }).format(date)
  }

  return (
    <Link href={`/issues/${issue.issueNumber}`}>
      <div className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${className}`}>
        <div className="space-y-3">
          {/* 期数标识 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              第 {issue.issueNumber} 期
            </span>
          </div>
          
          {/* 标题 */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {issue.optimizedTitle}
          </h3>
          
          {/* 描述和封面图 */}
          <div className="flex gap-4">
            {/* 封面图 */}
            {issue.coverImage && (
              <div className="flex-shrink-0">
                <img 
                  src={issue.coverImage} 
                  alt={`第 ${issue.issueNumber} 期封面图`}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
            
            {/* 描述 */}
            <div className="flex-1 min-w-0">
              <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                <SummaryRenderer 
                  content={issue.description} 
                  className="text-sm line-clamp-4"
                  maxLength={200}
                />
              </div>
            </div>
          </div>
          
          {/* 标签 */}
          {issue.tags.length > 0 && (
            <div className="relative pt-2">
              <div className="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide">
                {issue.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* 渐变蒙层 */}
              <div className="absolute right-0 top-2 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
