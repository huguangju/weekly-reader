'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export const ThemeToggle = React.memo(function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  const handleToggle = React.useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  if (!mounted) {
    return (
      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-all duration-200 ease-in-out">
        <div className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-200 ease-in-out translate-x-1">
          <Sun className="h-3 w-3 text-yellow-500 m-0.5 transition-colors duration-200 ease-in-out" />
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-200 ease-in-out focus:outline-none hover:scale-105 active:scale-95 cursor-pointer"
      aria-label="切换深色模式"
      title="切换深色模式"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full shadow-lg transition-all duration-200 ease-in-out ${
          isDark ? 'translate-x-6 bg-black' : 'translate-x-1 bg-white'
        }`}
      >
        <div className="transition-all duration-200 ease-in-out">
          {isDark ? (
            <Moon className="h-3 w-3 text-white m-0.5 transition-all duration-200 ease-in-out" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500 m-0.5 transition-all duration-200 ease-in-out" />
          )}
        </div>
      </span>
    </button>
  )
})
