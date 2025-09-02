'use client'

import React, { useState, useEffect } from 'react'
import { Search, Command } from 'lucide-react'
import { SearchModal } from './search-modal'

export function SearchBar() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const openSearchModal = () => setIsSearchModalOpen(true)
  const closeSearchModal = () => setIsSearchModalOpen(false)

  // 监听 Command + K 快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查是否是 Command + K (Mac) 或 Ctrl + K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        openSearchModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* 搜索框 */}
      <div 
        className="relative cursor-pointer w-[200px]"
        onClick={openSearchModal}
      >
        <div className="flex items-center justify-between space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600">
          <div className="flex items-center space-x-2">
            {/* 搜索图标 */}
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            
            {/* 占位符文本 */}
            <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:block">
              搜索期刊
            </span>
          </div>
          
          {/* 快捷键提示 */}
          <kbd className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-mono rounded border border-gray-200 dark:border-gray-600">
            <Command className="h-3 w-3 mr-1" />
            K
          </kbd>
        </div>
      </div>

      {/* 搜索模态框 */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearchModal} 
      />
    </>
  )
}
