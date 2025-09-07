'use client'

import React from 'react'
import { Github, ExternalLink } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function GitHubDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="GitHub 仓库"
        >
          <Github className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/ruanyf/weekly"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <div className="flex flex-col">
              <span>数据来源</span>
              <span className="text-xs text-muted-foreground">ruanyf/weekly</span>
            </div>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/huguangju/weekly-reader"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <div className="flex flex-col">
              <span>当前站点</span>
              <span className="text-xs text-muted-foreground">huguangju/weekly-reader</span>
            </div>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
