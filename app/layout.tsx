import type { Metadata } from 'next'
import './globals.css'
import { SearchBar } from '@/components/search-bar'
import { MobileMenu } from '@/components/mobile-menu'

export const metadata: Metadata = {
  title: '科技爱好者周刊 - 更好的阅读体验',
  description: '记录每周值得分享的科技内容，周五发布。这里提供更友好的阅读界面和分类浏览体验。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-wenkai">
        {/* 导航栏 */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  科技爱好者周刊
                </a>
              </div>
              
              {/* 导航链接 */}
              <div className="hidden md:flex items-center space-x-8">
                <a 
                  href="/" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                >
                  首页
                </a>
                <a 
                  href="/issues" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                >
                  所有期刊
                </a>
              </div>
              
              {/* 搜索框 */}
              <div className="hidden md:flex items-center">
                <SearchBar />
              </div>
              
              {/* 移动端菜单 */}
              <div className="md:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main>
          {children}
        </main>

        {/* 页脚 */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="text-sm">
                数据来源：{' '}
                <a 
                  href="https://github.com/ruanyf/weekly" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ruanyf/weekly
                </a>
              </p>
              <p className="text-sm mt-2">
                提供更友好的阅读界面和分类浏览体验
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}