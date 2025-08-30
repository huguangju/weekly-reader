'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`max-w-none ${className}`}>
      <ReactMarkdown
        rehypePlugins={[
          rehypeSlug,
          rehypeAutolinkHeadings,
          rehypeHighlight
        ]}
        components={{
          // 自定义标题组件，添加ID用于TOC导航
          h1: ({ children, ...props }) => (
            <h1 id={props.id} className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 pt-8 -mt-8" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 id={props.id} className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pt-8 -mt-8" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 id={props.id} className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3 pt-8 -mt-8" {...props}>
              {children}
            </h3>
          ),
          // 自定义段落组件
          p: ({ children, ...props }) => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props}>
              {children}
            </p>
          ),
          // 自定义链接组件
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          // 自定义代码块组件
          code: ({ children, className, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // 自定义代码块组件
          pre: ({ children, ...props }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4" {...props}>
              {children}
            </pre>
          ),
          // 自定义列表组件
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ol>
          ),
          // 自定义列表项组件
          li: ({ children, ...props }) => (
            <li className="text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </li>
          ),
          // 自定义引用组件
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4" {...props}>
              {children}
            </blockquote>
          ),
          // 自定义图片组件
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg shadow-sm mb-4"
              loading="lazy"
              {...props}
            />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
