import { CacheOptions } from '@/types'

interface CacheEntry<T> {
  value: T
  timestamp: number
  ttl: number
}

export class DataCache<T> {
  private static instance: DataCache<any>
  private cache = new Map<string, CacheEntry<T>>()
  private maxSize: number

  private constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  /**
   * 单例模式获取缓存实例
   */
  static getInstance<T>(maxSize?: number): DataCache<T> {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache<T>(maxSize)
    }
    return DataCache.instance
  }

  /**
   * 获取缓存数据，支持泛型类型
   */
  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.value
  }

  /**
   * 设置缓存数据，支持 TTL 过期时间
   */
  set(key: string, value: T, options: CacheOptions = {}): void {
    const { ttl = 5 * 60 * 1000 } = options // 默认5分钟过期

    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * 检查缓存中是否存在某个键
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  /**
   * 删除指定的缓存条目
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清理所有缓存数据
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    }
  }

  /**
   * 清理过期的缓存条目
   */
  cleanup(): number {
    const now = Date.now()
    let cleanedCount = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    return cleanedCount
  }
}
