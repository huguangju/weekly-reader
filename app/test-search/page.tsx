import { SearchButton } from '@/components/search-button'

export default function TestSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            搜索弹窗组件测试页面
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            点击下方的搜索按钮来测试搜索弹窗功能
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <SearchButton />
            <span className="text-gray-600 dark:text-gray-400">
              ← 点击这个搜索按钮
            </span>
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">测试说明：</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>点击搜索按钮打开搜索弹窗</li>
              <li>在搜索框中输入关键词（如：JavaScript、React、AI等）</li>
              <li>查看实时搜索结果和高亮显示</li>
              <li>点击搜索结果跳转到对应页面</li>
              <li>使用ESC键或点击背景关闭弹窗</li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 搜索提示
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              尝试搜索这些关键词：JavaScript、React、AI、区块链、云计算、移动开发等
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
