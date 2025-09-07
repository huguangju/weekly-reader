'use client'

import { useState, useRef, useEffect } from 'react'
import { DamageMapIcon } from '@/components/icons'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  onError,
  onLoad
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true)
    onLoad?.(event)
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true)
    onError?.(event)
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* 占位符 */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          {/* 骨架屏效果 */}
          <div className="relative w-full h-full">
            {/* 背景动画 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10 animate-pulse"></div>
            
            {/* 加载指示器和文字整体居中 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap hidden sm:block">
                加载中...
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* 实际图片 */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`transition-all duration-500 ease-out ${
            isLoaded 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      
      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <div className=" text-gray-400 dark:text-gray-500">
            <DamageMapIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>
      )}
    </div>
  )
}
