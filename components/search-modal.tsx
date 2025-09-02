'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, FileText, Tag, Calendar, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Issue } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: string
  title: string
  description: string
  publishDate: string
  tags: string[]
  fileName: string
  year: number
  month: number
  issueNumber: number
  content: string
  highlight: {
    title?: string
    description?: string
    content?: string
  }
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [allIssues, setAllIssues] = useState<Issue[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // 获取所有期刊数据
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('/api/issues')
        if (response.ok) {
          const data = await response.json()
          setAllIssues(data.issues || [])
        }
      } catch (error) {
        console.error('获取期刊数据失败:', error)
      }
    }

    if (isOpen) {
      fetchIssues()
    }
  }, [isOpen])

  // 搜索功能 - 使用Algolia
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    try {
      // 调用Algolia搜索API
      const response = await fetch(`/api/algolia/search?q=${encodeURIComponent(searchQuery)}`)
      
      if (!response.ok) {
        throw new Error(`搜索请求失败: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
        setSelectedIndex(-1) // 重置选中索引
      } else {
        console.error('搜索失败:', data.error)
        setResults([])
        setSelectedIndex(-1)
      }
    } catch (error) {
      console.error('搜索出错:', error)
      // 如果Algolia搜索失败，回退到本地搜索
      fallbackLocalSearch(searchQuery)
    } finally {
      setIsLoading(false)
    }
  }

  // 本地搜索回退方案
  const fallbackLocalSearch = (searchQuery: string) => {
    const searchResults = allIssues
      .filter(issue => {
        const searchTerm = searchQuery.toLowerCase()
        return (
          issue.title.toLowerCase().includes(searchTerm) ||
          issue.description.toLowerCase().includes(searchTerm) ||
          issue.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          issue.content.toLowerCase().includes(searchTerm)
        )
      })
      .map(issue => ({
        ...issue,
        publishDate: issue.publishDate.toString(),
        highlight: {
          title: highlightText(issue.title, searchQuery),
          description: highlightText(issue.description, searchQuery),
          content: highlightText(issue.content.substring(0, 200), searchQuery)
        }
      }))
      .slice(0, 10)

    setResults(searchResults)
    setSelectedIndex(-1) // 重置选中索引
  }

  // 高亮匹配文本
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
  }

  // 处理搜索输入
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1) // 重置选中索引
    performSearch(value)
  }

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    // 从文件名中提取期数，如 issue-355.md -> 355
    const issueNumber = result.issueNumber
    window.location.href = `/issues/${issueNumber}`
    onClose()
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (results.length > 0) {
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (results.length > 0) {
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleResultClick(results[selectedIndex])
      }
    }
  }

  // 监听全局 Command + K 快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查是否是 Command + K (Mac) 或 Ctrl + K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          // 如果模态框未打开，这里不需要处理，因为全局监听器会处理
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // 弹窗打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 搜索弹窗 */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              搜索期刊
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 搜索输入框 */}
        <div className="p-4">
          <Input
            ref={inputRef}
            type="text"
            placeholder="搜索标题、标签、内容关键词..."
            value={query}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className="w-full text-lg"
          />
        </div>

        {/* 搜索结果 */}
        <div className="max-h-96 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">使用 Algolia 搜索中...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedIndex === index
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
                        dangerouslySetInnerHTML={{ __html: result.highlight.title || result.title }}
                      />
                      <p 
                        className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: result.highlight.description || result.description }}
                      />
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{result.year}年{result.month}月</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>第{result.issueNumber}期</span>
                        </div>
                      </div>
                      {result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                          {result.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{result.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">未找到相关结果</p>
              <p className="text-sm">尝试使用不同的关键词搜索</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">开始搜索</p>
              <p className="text-sm">输入关键词搜索期刊内容</p>
            </div>
          )}
        </div>

        {/* 弹窗底部 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              {results.length > 0 && (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-mono rounded border border-gray-200 dark:border-gray-600">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-mono rounded border border-gray-200 dark:border-gray-600">
                      ↓
                    </kbd>
                    <span className="text-xs">切换</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-mono rounded border border-gray-200 dark:border-gray-600">
                      ↵
                    </kbd>
                    <span className="text-xs">选择</span>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-mono rounded border border-gray-200 dark:border-gray-600">
                  ESC
                </kbd>
                <span className="text-xs">关闭</span>
              </div>
            </div>
            {results.length > 0 && (
              <span>找到 {results.length} 个结果</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
