'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function SearchTrigger() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        router.push('/search')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <button
      onClick={() => router.push('/search')}
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 dark:border-white/10 bg-white/70 dark:bg-white/10 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-white/30 dark:hover:border-white/10 transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span>搜索</span>
      <kbd className="hidden lg:inline-flex items-center ml-2 px-1.5 py-0.5 rounded-lg bg-white/50 dark:bg-white/10 border border-white/10 dark:border-white/10 text-xs font-mono text-gray-600 dark:text-gray-400">
        ⌘K
      </kbd>
    </button>
  )
}
