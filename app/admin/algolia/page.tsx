'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AlgoliaAdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [isIndexing, setIsIndexing] = useState(false)
  const [indexResult, setIndexResult] = useState<any>(null)
  const [indexInfo, setIndexInfo] = useState<any>(null)

  // 索引数据到Algolia
  const handleIndexData = async () => {
    if (!adminKey.trim()) {
      alert('请输入管理员密钥')
      return
    }

    setIsIndexing(true)
    setIndexResult(null)

    try {
      const response = await fetch('/api/algolia/index', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      setIndexResult(data)

      if (data.success) {
        // 索引成功后获取索引信息
        await fetchIndexInfo()
      }
    } catch (error) {
      console.error('索引失败:', error)
      setIndexResult({
        success: false,
        error: '索引请求失败',
        details: error instanceof Error ? error.message : '未知错误'
      })
    } finally {
      setIsIndexing(false)
    }
  }

  // 获取索引信息
  const fetchIndexInfo = async () => {
    try {
      const response = await fetch('/api/algolia/index')
      const data = await response.json()
      setIndexInfo(data)
    } catch (error) {
      console.error('获取索引信息失败:', error)
    }
  }

  // 测试搜索
  const handleTestSearch = async () => {
    try {
      const response = await fetch('/api/algolia/search?q=JavaScript')
      const data = await response.json()
      console.log('搜索测试结果:', data)
      alert(`搜索测试完成，找到 ${data.results?.length || 0} 个结果`)
    } catch (error) {
      console.error('搜索测试失败:', error)
      alert('搜索测试失败')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Algolia 搜索管理
          </h1>

          {/* 管理员密钥输入 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              管理员密钥
            </label>
            <Input
              type="password"
              placeholder="输入您的 Algolia 管理员密钥"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="max-w-md"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              此密钥用于索引数据，不会存储在前端
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              onClick={handleIndexData}
              disabled={isIndexing || !adminKey.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isIndexing ? '索引中...' : '索引期刊数据'}
            </Button>

            <Button
              onClick={fetchIndexInfo}
              variant="outline"
              className="border-gray-300"
            >
              获取索引信息
            </Button>

            <Button
              onClick={handleTestSearch}
              variant="outline"
              className="border-green-300 text-green-700"
            >
              测试搜索
            </Button>
          </div>

          {/* 索引结果 */}
          {indexResult && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                索引结果
              </h2>
              <div className={`p-4 rounded-lg ${
                indexResult.success 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <div className="text-sm">
                  <p className={`font-medium ${
                    indexResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {indexResult.success ? '✅ 索引成功' : '❌ 索引失败'}
                  </p>
                  {indexResult.message && (
                    <p className="mt-2 text-green-700 dark:text-green-300">
                      {indexResult.message}
                    </p>
                  )}
                  {indexResult.error && (
                    <p className="mt-2 text-red-700 dark:text-red-300">
                      错误: {indexResult.error}
                    </p>
                  )}
                  {indexResult.details && (
                    <p className="mt-2 text-red-600 dark:text-red-400">
                      详情: {indexResult.details}
                    </p>
                  )}
                  {indexResult.indexedCount && (
                    <p className="mt-2 text-green-600 dark:text-green-400">
                      已索引: {indexResult.indexedCount} 个期刊
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 索引信息 */}
          {indexInfo && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                索引信息
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm space-y-2">
                  <p><strong>索引名称:</strong> {indexInfo.indexName}</p>
                  {indexInfo.searchableAttributes && (
                    <p><strong>可搜索属性:</strong> {indexInfo.searchableAttributes.join(', ')}</p>
                  )}
                  {indexInfo.attributesForFaceting && (
                    <p><strong>分面属性:</strong> {indexInfo.attributesForFaceting.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              📚 使用说明
            </h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p>1. 首先在项目根目录创建 <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">.env.local</code> 文件</p>
              <p>2. 配置 Algolia 环境变量（参考 ALGOLIA_SETUP.md）</p>
              <p>3. 输入管理员密钥并点击"索引期刊数据"</p>
              <p>4. 索引成功后，搜索弹窗将使用 Algolia 搜索</p>
              <p>5. 可以点击"测试搜索"验证功能是否正常</p>
            </div>
          </div>

          {/* 注意事项 */}
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ 注意事项
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• 管理员密钥只在索引时使用，不会存储</li>
              <li>• 索引操作可能需要几分钟时间</li>
              <li>• 确保网络连接稳定</li>
              <li>• 如果索引失败，检查密钥和网络设置</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
