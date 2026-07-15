'use client'

import { useEffect, useState } from 'react'

type FontSize = 'small' | 'medium' | 'large'

const STORAGE_KEY = 'blog-font-size'

/* Tailwind Typography size modifiers */
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

    // Find the .prose content container and apply Typography size modifiers
    const proseEl = document.querySelector('.prose')
    if (!proseEl) return

    // Remove all prose size classes, then add the selected one
    proseEl.classList.remove(...PROSE_CLASSES)
    proseEl.classList.add(SIZE_CLASS[size])

    localStorage.setItem(STORAGE_KEY, size)
  }, [size, mounted])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-600 dark:text-gray-400">字体：</span>
      {(['small', 'medium', 'large'] as FontSize[]).map((s) => (
        <button
          key={s}
          onClick={() => setSize(s)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            size === s
              ? 'bg-white/50 dark:bg-white/10 text-gray-800 dark:text-gray-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
          }`}
        >
          {s === 'small' ? '小' : s === 'medium' ? '中' : '大'}
        </button>
      ))}
    </div>
  )
}
