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
      className="w-11 h-11 rounded-xl glass-liquid flex items-center justify-center cursor-pointer transition-all hover:border-[var(--color-primary)] group"
      aria-label="搜索"
      title="搜索 (Ctrl+K)"
    >
      <IconSearch size={16} strokeWidth={1.5} className="group-hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--color-muted)' }} />
    </button>
  )
}
