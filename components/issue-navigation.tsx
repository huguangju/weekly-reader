'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'
import { Issue } from '@/types'
import { cn } from '@/lib/utils'

interface IssueNavigationProps {
  previous: Issue | null
  next: Issue | null
  className?: string
}

export function IssueNavigation({ previous, next, className }: IssueNavigationProps) {
  const router = useRouter()

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只在没有焦点在输入框时响应快捷键
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.key === 'ArrowLeft' && previous) {
        event.preventDefault()
        router.push(`/issues/${previous.issueNumber}`)
      } else if (event.key === 'ArrowRight' && next) {
        event.preventDefault()
        router.push(`/issues/${next.issueNumber}`)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [previous, next, router])

  if (!previous && !next) {
    return null
  }

  return (
    <nav 
      className={cn(
        "flex items-center justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
        className
      )}
      aria-label="期刊导航"
    >
      {/* 上一期 */}
      <div className="flex-1">
        {previous ? (
          <Link
            href={`/issues/${previous.issueNumber}`}
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={`上一期: ${previous.title}`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
              <ArrowLeftIcon className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-500 dark:text-gray-400">上一期</div>
              <div className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                第 {previous.issueNumber} 期
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {previous.title.replace(/^科技爱好者周刊（第\d+期）：?/, '').trim()}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-3 opacity-50">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600">
              <ArrowLeftIcon className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 dark:text-gray-500">没有更早的期刊</div>
            </div>
          </div>
        )}
      </div>

      {/* 分隔线 */}
      <div className="hidden sm:block w-px h-16 bg-gray-200 dark:bg-gray-700" />

      {/* 下一期 */}
      <div className="flex-1">
        {next ? (
          <Link
            href={`/issues/${next.issueNumber}`}
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
            title={`下一期: ${next.title}`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-500 dark:text-gray-400">下一期</div>
              <div className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                第 {next.issueNumber} 期
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {next.title.replace(/^科技爱好者周刊（第\d+期）：?/, '').trim()}
              </div>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
              <ArrowRightIcon className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-3 opacity-50 justify-end">
            <div className="flex-1 text-right">
              <div className="text-sm text-gray-400 dark:text-gray-500">没有更新的期刊</div>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-600">
              <ArrowRightIcon className="text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// 移动端优化的简化版本
export function MobileIssueNavigation({ previous, next, className }: IssueNavigationProps) {
  const router = useRouter()

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.key === 'ArrowLeft' && previous) {
        event.preventDefault()
        router.push(`/issues/${previous.issueNumber}`)
      } else if (event.key === 'ArrowRight' && next) {
        event.preventDefault()
        router.push(`/issues/${next.issueNumber}`)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [previous, next, router])

  if (!previous && !next) {
    return null
  }

  return (
    <nav 
      className={cn(
        "flex gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
        className
      )}
      aria-label="期刊导航"
    >
      {/* 上一期按钮 */}
      {previous ? (
        <Link
          href={`/issues/${previous.issueNumber}`}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          title={`上一期: ${previous.title}`}
        >
          <ArrowLeftIcon size="sm" className="text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            第 {previous.issueNumber} 期
          </span>
        </Link>
      ) : (
        <div className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 opacity-50">
          <ArrowLeftIcon size="sm" className="text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-400 dark:text-gray-500">无</span>
        </div>
      )}

      {/* 下一期按钮 */}
      {next ? (
        <Link
          href={`/issues/${next.issueNumber}`}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          title={`下一期: ${next.title}`}
        >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            第 {next.issueNumber} 期
          </span>
          <ArrowRightIcon size="sm" className="text-gray-600 dark:text-gray-300" />
        </Link>
      ) : (
        <div className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 opacity-50">
          <span className="text-sm text-gray-400 dark:text-gray-500">无</span>
          <ArrowRightIcon size="sm" className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
    </nav>
  )
}