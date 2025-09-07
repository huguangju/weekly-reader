'use client'

import { useState, useEffect, useRef } from 'react'
import { TimeIndex } from '@/types'


interface FloatingNavProps {
  timeIndex: TimeIndex[]
}

export function FloatingNav({ timeIndex }: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

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
      
      // 移动端不显示悬浮导航，桌面端当滚动超过页面高度的20%时显示
      if (!isMobile) {
        setIsVisible(scrollY > windowHeight * 0.2)
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
        const offset = isMobile ? 80 : 120

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
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
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

  // 移动端不显示悬浮导航
  if (isMobile) {
    return null
  }

  return (
    <div
      ref={navRef}
      className={`fixed left-4 lg:left-6 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <div 
          className={`w-35 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-3 max-h-[70vh] overflow-y-auto transition-all duration-500 ease-out ${
            isHovered ? 'scale-105 shadow-3xl' : 'scale-100'
          } scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}
        >
          <div className="space-y-3">
          {timeIndex.map((yearData) => (
            <div key={yearData.year} className="space-y-1">
              {/* 年份按钮 */}
              <button
                onClick={() => handleYearClick(yearData.year)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                  activeYear === yearData.year
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 font-semibold shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="text-base font-medium">{yearData.year}</span>
              </button>

              {/* 月份列表 */}
              <div className="ml-3 space-y-1">
                {yearData.months.map((monthData) => (
                  <button
                    key={`${yearData.year}-${monthData.month}`}
                    onClick={() => handleMonthClick(yearData.year, monthData.month)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-md active:scale-95 ${
                      activeMonth === `${yearData.year}-${monthData.month}`
                        ? 'bg-gradient-to-r from-blue-50 to-blue-25 dark:from-blue-900/30 dark:to-blue-800/10 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{monthData.month}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                        {monthData.issues.length}期
                      </span>
                    </div>
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
