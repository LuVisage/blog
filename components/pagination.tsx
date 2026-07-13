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

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-12" aria-label="分页导航">
      {currentPage > 1 && (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all"
        >
          ← 上一页
        </Link>
      )}

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-300 dark:text-gray-600">
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={page === 1 ? basePath : `${basePath}?page=${page}`}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25'
                : 'text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all"
        >
          下一页 →
        </Link>
      )}
    </nav>
  )
}
