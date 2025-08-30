'use client'

import { Issue } from '@/types'
import Link from 'next/link'

interface IssueCardProps {
  issue: Issue
  className?: string
}

export function IssueCard({ issue, className = '' }: IssueCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(issue.publishDate)}
            </span>
          </div>
          
          {/* 标题 */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {issue.title}
          </h3>
          
          {/* 描述 */}
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {issue.description}
          </p>
          
          {/* 标签 */}
          {issue.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {issue.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
              {issue.tags.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  +{issue.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
