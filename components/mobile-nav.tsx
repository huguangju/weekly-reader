'use client'

import { useState, useEffect } from 'react'
import { TimeIndex } from '@/types'

interface MobileNavProps {
  timeIndex: TimeIndex[]
}

export function MobileNav({ timeIndex }: MobileNavProps) {
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // 改为 lg 断点
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 监听滚动事件，更新活跃状态
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // 移动端当滚动超过页面高度的30%时显示导航
      if (isMobile) {
        setIsVisible(scrollY > windowHeight * 0.3)
      }

      // 更新活跃的年月
      updateActiveSection()
    }

    const updateActiveSection = () => {
      const sections = document.querySelectorAll('[data-year], [data-month]')
      let currentYear = null
      let currentMonth = null

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const offset = 100 // 增加偏移量，考虑导航栏高度

        if (rect.top <= offset && rect.bottom > offset) {
          if (section.hasAttribute('data-year')) {
            const yearValue = section.getAttribute('data-year')
            currentYear = yearValue ? parseInt(yearValue, 10) : null
          }
          if (section.hasAttribute('data-month')) {
            currentMonth = section.getAttribute('data-month')
          }
        }
      })

      setActiveYear(currentYear)
      setActiveMonth(currentMonth)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // 平滑滚动到指定元素
  const scrollToElement = (selector: string) => {
    const element = document.querySelector(selector)
    if (element) {
      // 计算导航栏高度，确保内容不被遮挡
      const navHeight = 80 // 导航栏高度
      const elementTop = element.getBoundingClientRect().top + window.scrollY
      
      window.scrollTo({
        top: elementTop - navHeight - 20, // 额外偏移20px
        behavior: 'smooth'
      })
    }
  }

  // 点击年份处理
  const handleYearClick = (year: number) => {
    const yearData = timeIndex.find(y => y.year === year)
    if (yearData && yearData.months.length > 0) {
      const firstMonth = yearData.months[0]
      scrollToElement(`[data-month="${year}-${firstMonth.month}"]`)
    }
  }

  // 点击月份处理
  const handleMonthClick = (year: number, month: string) => {
    scrollToElement(`[data-month="${year}-${month}"]`)
  }

  // 桌面端不显示移动端导航
  if (!isMobile) {
    return null
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}
    >
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 px-4 py-3 shadow-lg">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          {timeIndex.map((yearData) => (
            <div key={yearData.year} className="flex-shrink-0">
              {/* 年份按钮 */}
              <button
                onClick={() => handleYearClick(yearData.year)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeYear === yearData.year
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                {yearData.year}
              </button>

              {/* 月份按钮 */}
              <div className="flex items-center space-x-1 mt-1">
                {yearData.months.map((monthData) => (
                  <button
                    key={`${yearData.year}-${monthData.month}`}
                    onClick={() => handleMonthClick(yearData.year, monthData.month)}
                    className={`px-2 py-1 rounded text-xs transition-all duration-200 ${
                      activeMonth === `${yearData.year}-${monthData.month}`
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    {monthData.month}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
