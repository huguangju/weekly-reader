'use client'

import ReactMarkdown from 'react-markdown'

interface SummaryRendererProps {
  content: string
  className?: string
  maxLength?: number
}

export function SummaryRenderer({ content, className = '', maxLength }: SummaryRendererProps) {
  // 如果设置了最大长度，截取内容
  const displayContent = maxLength && content.length > maxLength 
    ? content.slice(0, maxLength) + '...'
    : content

  return (
    <div className={`max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // 段落组件，用于简介显示
          p: ({ children, ...props }) => (
            <span className="text-inherit leading-relaxed" {...props}>
              {children}
            </span>
          ),
          // 链接组件，保持简洁样式
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-1 underline-offset-1 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          // 内联代码组件，适合简介中的代码片段
          code: ({ children, className, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                  {children}
                </code>
              )
            }
            // 对于代码块，在简介中只显示为内联代码
            return (
              <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                {children}
              </code>
            )
          },
          // 粗体组件
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-inherit" {...props}>
              {children}
            </strong>
          ),
          // 斜体组件
          em: ({ children, ...props }) => (
            <em className="italic text-inherit" {...props}>
              {children}
            </em>
          ),
          // 标题组件，在简介中只显示文本内容
          h1: ({ children, ...props }) => <span className="text-inherit font-semibold" {...props}>{children}</span>,
          h2: ({ children, ...props }) => <span className="text-inherit font-semibold" {...props}>{children}</span>,
          h3: ({ children, ...props }) => <span className="text-inherit font-semibold" {...props}>{children}</span>,
          h4: ({ children, ...props }) => <span className="text-inherit font-semibold" {...props}>{children}</span>,
          h5: ({ children, ...props }) => <span className="text-inherit font-semibold" {...props}>{children}</span>,
          h6: ({ children, ...props }) => <span className="text-inherit font-semibold" {...props}>{children}</span>,
          // 其他元素，在简介中只显示文本内容
          pre: ({ children, ...props }) => <span className="text-inherit" {...props}>{children}</span>,
          ul: ({ children, ...props }) => <span className="text-inherit" {...props}>{children}</span>,
          ol: ({ children, ...props }) => <span className="text-inherit" {...props}>{children}</span>,
          li: ({ children, ...props }) => <span className="text-inherit" {...props}>{children}</span>,
          blockquote: ({ children, ...props }) => <span className="text-inherit" {...props}>{children}</span>,
          img: ({ alt, ...props }) => <span className="text-inherit" {...props}>{alt}</span>,
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  )
}

/*
使用示例：

// 基本使用
<SummaryRenderer content="这是一段简介内容" />

// 带样式类名
<SummaryRenderer 
  content="这是一段简介内容" 
  className="text-sm text-gray-600" 
/>

// 限制最大长度
<SummaryRenderer 
  content="这是一段很长的简介内容..." 
  maxLength={100} 
/>

// 在卡片中使用
<SummaryRenderer 
  content={issue.description} 
  className="text-sm line-clamp-3"
  maxLength={200}
/>
*/
