'use client'

import Link from 'next/link'

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

  const ghostStyle = {
    color: 'var(--color-muted)',
  }

  const ghostActiveStyle = {
    color: '#fff',
    background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)',
    boxShadow: '0 2px 8px rgba(124,92,231,0.25)',
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-16" aria-label="分页导航">
      {currentPage > 1 && (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[var(--color-primary-soft)]"
          style={ghostStyle}
        >
          ← 上一页
        </Link>
      )}

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm" style={{ color: 'var(--color-muted-soft)' }}>
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={page === 1 ? basePath : `${basePath}?page=${page}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all"
            style={
              page === currentPage
                ? ghostActiveStyle
                : ghostStyle
            }
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[var(--color-primary-soft)]"
          style={ghostStyle}
        >
          下一页 →
        </Link>
      )}
    </nav>
  )
}
