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
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-pink-100 dark:border-purple-500/20 bg-white/50 dark:bg-purple-950/30 text-sm text-gray-400 dark:text-gray-500 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-purple-500/40 transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span>搜索</span>
      <kbd className="hidden lg:inline-flex items-center ml-2 px-1.5 py-0.5 rounded-lg bg-pink-50 dark:bg-purple-950/50 border border-pink-100 dark:border-purple-500/20 text-xs font-mono text-gray-400 dark:text-gray-500">
        ⌘K
      </kbd>
    </button>
  )
}
