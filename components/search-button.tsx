'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from './ui/button'
import { SearchModal } from './search-modal'

export function SearchButton() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const openSearchModal = () => setIsSearchModalOpen(true)
  const closeSearchModal = () => setIsSearchModalOpen(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={openSearchModal}
        className="h-9 w-9 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="搜索期刊"
      >
        <Search className="h-5 w-5" />
      </Button>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearchModal} 
      />
    </>
  )
}
