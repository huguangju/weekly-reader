'use client'

import { useState, useEffect } from 'react'

interface HeadingItem {
  id: string
  text: string
  level: number
}

interface TOCProps {
  className?: string
}

export function TOC({ className = '' }: TOCProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [activeHeading, setActiveHeading] = useState<string | null>(null)

  useEffect(() => {
    // TOC 不显示一级标题，仅收集 h2-h6
    const headingElements = document.querySelectorAll('h2, h3, h4, h5, h6')
    const headingList: HeadingItem[] = []

    headingElements.forEach((element) => {
      const id = element.id
      const text = element.textContent || ''
      const level = parseInt(element.tagName.charAt(1))

      if (id && text) {
        headingList.push({ id, text, level })
      }
    })

    setHeadings(headingList)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollTop = window.scrollY + 100 // 偏移量
      let currentHeading = null

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        const element = document.getElementById(heading.id)
        
        if (element && scrollTop >= element.offsetTop) {
          currentHeading = heading.id
          break
        }
      }

      setActiveHeading(currentHeading)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查

    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        目录
      </h3>
      
      <nav className="space-y-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
              activeHeading === heading.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  )
}
