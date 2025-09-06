'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import styles from './link-preview.module.css'

interface LinkPreviewData {
  title?: string
  description?: string
  image?: string
  url: string
  domain?: string
}

interface LinkPreviewProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

interface TooltipPosition {
  x: number
  y: number
}

export function LinkPreview({ href, children, className, ...props }: LinkPreviewProps) {
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 })
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isAbove, setIsAbove] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isMouseOverLinkOrTooltip = useRef(false)

  // 检查是否为外部链接
  const isExternal = href?.startsWith('http') || href?.startsWith('//')

  const fetchPreviewData = useCallback(async (url: string, retry = false) => {
    if (!isExternal) return

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
      if (response.ok) {
        const data = await response.json()
        setPreviewData(data)
        setRetryCount(0)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to fetch link preview:', error)
      const errorMessage = error instanceof Error ? error.message : '获取预览失败'
      setError(errorMessage)
      
      // 自动重试机制（最多重试2次）
      if (!retry && retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchPreviewData(url, true)
        }, 1000 * (retryCount + 1)) // 递增延迟
      }
    } finally {
      setIsLoading(false)
    }
  }, [isExternal, retryCount])

  const updateTooltipPosition = useCallback(() => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const tooltipWidth = 320 // 20rem = 320px
      const tooltipHeight = 384 // 24rem = 384px
      
      let x = rect.left + rect.width / 2
      let y = rect.bottom + 8
      let above = false
      
      // 水平边界检测
      if (x - tooltipWidth / 2 < 8) {
        x = tooltipWidth / 2 + 8
      } else if (x + tooltipWidth / 2 > viewportWidth - 8) {
        x = viewportWidth - tooltipWidth / 2 - 8
      }
      
      // 垂直边界检测
      if (y + tooltipHeight > viewportHeight - 8) {
        y = viewportHeight - rect.top + 8 // 使用bottom定位
        above = true
      }
      
      setTooltipPosition({ x, y })
      setIsAbove(above)
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!isExternal) return

    isMouseOverLinkOrTooltip.current = true
    updateTooltipPosition()
    
    // 延迟显示预览，避免鼠标快速划过时频繁请求
    timeoutRef.current = setTimeout(() => {
      if (!previewData && !isLoading) {
        fetchPreviewData(href)
      }
      setShowPreview(true)
    }, 500)
  }, [isExternal, updateTooltipPosition, previewData, isLoading, fetchPreviewData, href])

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    isMouseOverLinkOrTooltip.current = false
    
    // 延迟隐藏，给鼠标移动到 tooltip 的时间
    hideTimeoutRef.current = setTimeout(() => {
      if (!isMouseOverLinkOrTooltip.current) {
        setIsExiting(true)
        setTimeout(() => {
          setShowPreview(false)
          setIsExiting(false)
        }, 150) // 等待退出动画完成
      }
    }, 300) // 增加到 300ms 延迟
  }, [])

  const handleTooltipMouseEnter = useCallback(() => {
    // 清除隐藏定时器
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    isMouseOverLinkOrTooltip.current = true
    setIsHoveringTooltip(true)
  }, [])

  const handleTooltipMouseLeave = useCallback(() => {
    isMouseOverLinkOrTooltip.current = false
    setIsHoveringTooltip(false)
    // 延迟隐藏，给鼠标移动回链接的时间
    hideTimeoutRef.current = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        setShowPreview(false)
        setIsExiting(false)
      }, 150) // 等待退出动画完成
    }, 300)
  }, [])

  const handleFocus = useCallback(() => {
    if (!isExternal) return
    setIsFocused(true)
    updateTooltipPosition()
    if (!previewData && !isLoading) {
      fetchPreviewData(href)
    }
    setShowPreview(true)
  }, [isExternal, updateTooltipPosition, previewData, isLoading, fetchPreviewData, href])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    // 延迟隐藏，给键盘导航到 tooltip 的时间
    hideTimeoutRef.current = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        setShowPreview(false)
        setIsExiting(false)
      }, 150) // 等待退出动画完成
    }, 300)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExiting(true)
      setTimeout(() => {
        setShowPreview(false)
        setIsExiting(false)
      }, 150)
      linkRef.current?.blur()
    }
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    setRetryCount(0)
    fetchPreviewData(href)
  }, [fetchPreviewData, href])


  // 清理定时器和监听器
  useEffect(() => {
    const handleScroll = () => {
      if (showPreview) {
        updateTooltipPosition()
      }
    }

    const handleResize = () => {
      if (showPreview) {
        updateTooltipPosition()
      }
    }

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [showPreview])

  // 生成预览内容
  const getPreviewContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {retryCount > 0 ? `重试中... (${retryCount}/2)` : '加载中...'}
          </span>
        </div>
      )
    }

    if (error) {
      return (
        <div className={styles.content}>
          <div className="text-sm text-red-600 dark:text-red-400 mb-2">
            加载失败: {error}
          </div>
          <button
            onClick={handleRetry}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            aria-label="重试加载预览"
          >
            重试
          </button>
        </div>
      )
    }

    if (!previewData) {
      return (
        <div className={styles.content}>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {href}
          </div>
        </div>
      )
    }

    return (
      <div className={styles.content}>
        {previewData.image && (
          <img
            src={previewData.image}
            alt={previewData.title || 'Preview'}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <div className="space-y-2">
          <div className={styles.title}>
            {previewData.title || '无标题'}
          </div>
          {previewData.description && (
            <div className={styles.description}>
              {previewData.description}
            </div>
          )}
          <div className={styles.domain}>
            {previewData.domain || new URL(href).hostname}
          </div>
        </div>
      </div>
    )
  }, [isLoading, previewData, href, error, retryCount, handleRetry])

  if (!isExternal) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    )
  }

  return (
    <>
      <a
        ref={linkRef}
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-describedby={showPreview ? 'link-preview-tooltip' : undefined}
        {...props}
      >
        {children}
      </a>
      
      {showPreview && createPortal(
        <div
          ref={tooltipRef}
          id="link-preview-tooltip"
          className={`${styles.tooltip} ${isExiting ? styles.tooltipExiting : ''}`}
          role="tooltip"
          aria-live="polite"
          style={{
            left: tooltipPosition.x,
            ...(isAbove ? { bottom: tooltipPosition.y } : { top: tooltipPosition.y }),
            transform: 'translateX(-50%)'
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          {/* 透明的桥接区域，连接链接和 tooltip */}
          <div 
            className={`${styles.bridge} ${isAbove ? styles.bridgeAbove : ''}`}
            onMouseEnter={handleTooltipMouseEnter}
          />
          <div className={styles.container}>
            {getPreviewContent}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
