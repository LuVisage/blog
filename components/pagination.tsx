'use client'

import Link from 'next/link'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  const pageLinkStyle = (isActive: boolean) => ({
    color: isActive ? '#fff' : 'var(--color-muted)',
    background: isActive ? 'linear-gradient(135deg, var(--color-primary), #a78bfa)' : 'transparent',
    boxShadow: isActive ? '0 2px 8px rgba(124,92,231,0.25)' : undefined,
  })

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-16" aria-label="分页导航">
      {currentPage > 1 ? (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[var(--color-primary-soft)]"
          style={{ color: 'var(--color-muted)' }}
        >
          <IconChevronLeft size={14} strokeWidth={2} />
          上一页
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium opacity-30" style={{ color: 'var(--color-muted)' }}>
          <IconChevronLeft size={14} strokeWidth={2} />
          上一页
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs" style={{ color: 'var(--color-muted-soft)' }}>
              ···
            </span>
          ) : (
            <Link
              key={page}
              href={page === 1 ? basePath : `${basePath}?page=${page}`}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all hover:bg-[var(--color-primary-soft)]"
              style={pageLinkStyle(page === currentPage)}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[var(--color-primary-soft)]"
          style={{ color: 'var(--color-muted)' }}
        >
          下一页
          <IconChevronRight size={14} strokeWidth={2} />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium opacity-30" style={{ color: 'var(--color-muted)' }}>
          下一页
          <IconChevronRight size={14} strokeWidth={2} />
        </span>
      )}
    </nav>
  )
}
