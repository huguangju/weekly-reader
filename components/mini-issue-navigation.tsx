'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { Issue } from '@/types'
import { cn } from '@/lib/utils'

interface MiniIssueNavigationProps {
  previous: Issue | null
  next: Issue | null
  className?: string
}

export function MiniIssueNavigation({ previous, next, className }: MiniIssueNavigationProps) {
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
    <div 
      className={cn(
        "flex items-center gap-2",
        className
      )}
    >
      {/* 上一期 */}
      {previous ? (
        <Link
          href={`/issues/${previous.issueNumber}`}
          className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title={`上一期: ${previous.title}`}
        >
          上一期 ({previous.issueNumber})
        </Link>
      ) : (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          上一期
        </span>
      )}

      <span className="text-xs text-gray-400 dark:text-gray-500">|</span>

      {/* 下一期 */}
      {next ? (
        <Link
          href={`/issues/${next.issueNumber}`}
          className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title={`下一期: ${next.title}`}
        >
          下一期 ({next.issueNumber})
        </Link>
      ) : (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          下一期
        </span>
      )}
    </div>
  )
}