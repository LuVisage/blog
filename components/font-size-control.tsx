'use client'

import { useEffect, useState } from 'react'

type FontSize = 'small' | 'medium' | 'large'

const STORAGE_KEY = 'blog-font-size'
const PROSE_CLASSES = ['prose-sm', 'prose-base', 'prose-lg'] as const

const SIZE_CLASS: Record<FontSize, string> = {
  small: 'prose-sm',
  medium: 'prose-base',
  large: 'prose-lg',
}

function getStoredSize(): FontSize {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'small' || stored === 'medium' || stored === 'large') return stored
  } catch {}
  return 'medium'
}

export function FontSizeControl() {
  const [size, setSize] = useState<FontSize>('medium')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setSize(getStoredSize())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const proseEl = document.querySelector('.prose')
    if (!proseEl) return
    proseEl.classList.remove(...PROSE_CLASSES)
    proseEl.classList.add(SIZE_CLASS[size])
    localStorage.setItem(STORAGE_KEY, size)
  }, [size, mounted])

  if (!mounted) return null

  const baseBtnClass = 'px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150'

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs" style={{ color: 'var(--color-muted-soft)' }}>字体：</span>
      {(['small', 'medium', 'large'] as FontSize[]).map((s) => (
        <button
          key={s}
          onClick={() => setSize(s)}
          className={baseBtnClass}
          style={{
            backgroundColor: size === s ? 'var(--color-primary-soft)' : 'transparent',
            color: size === s ? 'var(--color-ink)' : 'var(--color-muted)',
          }}
        >
          {s === 'small' ? '小' : s === 'medium' ? '中' : '大'}
        </button>
      ))}
    </div>
  )
}
