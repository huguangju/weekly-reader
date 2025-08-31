import { algoliasearch } from 'algoliasearch'

// Algolia 配置
export const ALGOLIA_CONFIG = {
  // 这些值应该从环境变量获取，这里使用示例值
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'your-app-id',
  searchKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || 'your-search-key',
  adminKey: process.env.ALGOLIA_ADMIN_KEY || 'your-admin-key',
  indexName: 'weekly-issues'
}

// 创建搜索客户端 - 使用 v5 API
export const searchClient = algoliasearch(
  ALGOLIA_CONFIG.appId,
  ALGOLIA_CONFIG.searchKey
)

// 创建管理客户端（用于索引数据）
export const adminClient = algoliasearch(
  ALGOLIA_CONFIG.appId,
  ALGOLIA_CONFIG.adminKey
)

// 搜索配置
export const searchConfig = {
  hitsPerPage: 10,
  attributesToRetrieve: [
    'id',
    'title',
    'description',
    'tags',
    'year',
    'month',
    'issueNumber',
    'fileName'
  ],
  attributesToHighlight: [
    'title',
    'description',
    'tags',
    'content'
  ],
  highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">',
  highlightPostTag: '</mark>'
}

// 索引配置
export const indexConfig = {
  searchableAttributes: [
    'title',
    'description',
    'tags',
    'content'
  ],
  attributesForFaceting: [
    'tags',
    'year',
    'month'
  ],
  ranking: [
    'typo',
    'geo',
    'words',
    'filters',
    'proximity',
    'attribute',
    'exact',
    'custom'
  ]
}
