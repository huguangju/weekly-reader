'use client'

import React, { useState } from 'react'
import { Search, X, Menu } from 'lucide-react'
import { SearchModal } from './search-modal'

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)
  const openSearchModal = () => {
    setIsSearchModalOpen(true)
    closeMenu()
  }
  const closeSearchModal = () => setIsSearchModalOpen(false)

  return (
    <>
      {/* 菜单按钮 */}
      <button 
        onClick={openMenu}
        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* 菜单遮罩 */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* 菜单面板 */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* 菜单头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            菜单
          </h2>
          <button
            onClick={closeMenu}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 菜单内容 */}
        <div className="p-4 space-y-4">
          {/* 搜索按钮 */}
          <button
            onClick={openSearchModal}
            className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100">搜索期刊</span>
          </button>

          {/* 导航链接 */}
          <div className="space-y-2">
            <a 
              href="/" 
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              首页
            </a>
            <a 
              href="/issues" 
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={closeMenu}
            >
              所有期刊
            </a>
          </div>
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
