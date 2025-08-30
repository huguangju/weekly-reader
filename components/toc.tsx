'use client'

import { useState, useEffect } from 'react'

interface TOCProps {
  tags: string[]
  className?: string
}

export function TOC({ tags, className = '' }: TOCProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const headings = tags.map(tag => {
        const element = document.getElementById(tag)
        return element ? { tag, element, top: element.offsetTop } : null
      }).filter(Boolean)

      if (headings.length === 0) return

      const scrollTop = window.scrollY + 100 // 偏移量

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading && scrollTop >= heading.top) {
          setActiveTag(heading.tag)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查

    return () => window.removeEventListener('scroll', handleScroll)
  }, [tags])

  const scrollToTag = (tag: string) => {
    const element = document.getElementById(tag)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (tags.length === 0) {
    return null
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        目录导航
      </h3>
      
      <nav className="space-y-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => scrollToTag(tag)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
              activeTag === tag
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </nav>
    </div>
  )
}
