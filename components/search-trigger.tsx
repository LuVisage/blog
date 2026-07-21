'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { IconSearch } from '@tabler/icons-react'

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
      className="btn-ghost h-8 px-3 text-sm gap-1.5"
    >
      <IconSearch size={14} strokeWidth={1.5} />
      <span>搜索</span>
      <kbd
        className="hidden lg:inline-flex items-center ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono"
        style={{
          backgroundColor: 'var(--color-primary-soft)',
          color: 'var(--color-muted-soft)',
          border: '1px solid var(--color-hairline)',
        }}
      >
        ⌘K
      </kbd>
    </button>
  )
}
