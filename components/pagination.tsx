import Link from 'next/link'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

/** 第 1 页就是 /posts/，后续页才走 /posts/page/[n]/。 */
function hrefFor(page: number): string {
  return page === 1 ? '/posts' : `/posts/page/${page}`
}

/**
 * 列表分页。静态导出下每一页都是真实路由（见 app/posts/page/[page]），
 * 所以这里只负责渲染链接；窗口算法在页数很多时把中间折成省略号。
 */
export function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null

  const items: (number | 'gap')[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= 1) items.push(p)
    else if (items[items.length - 1] !== 'gap') items.push('gap')
  }

  const prev = current > 1 ? hrefFor(current - 1) : null
  const next = current < total ? hrefFor(current + 1) : null

  return (
    <nav className="apple-pagination mt-12" aria-label="文章分页">
      {prev ? (
        <Link href={prev} className="apple-pagination__item" aria-label="上一页" rel="prev">
          <IconChevronLeft size={18} strokeWidth={2} />
        </Link>
      ) : (
        <span className="apple-pagination__item" aria-disabled="true" aria-label="已是第一页">
          <IconChevronLeft size={18} strokeWidth={2} />
        </span>
      )}

      {items.map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} className="apple-pagination__ellipsis" aria-hidden="true">…</span>
        ) : item === current ? (
          <span key={item} className="apple-pagination__item" aria-current="page" aria-label={`第 ${item} 页`}>
            {item}
          </span>
        ) : (
          <Link key={item} href={hrefFor(item)} className="apple-pagination__item" aria-label={`第 ${item} 页`}>
            {item}
          </Link>
        )
      )}

      {next ? (
        <Link href={next} className="apple-pagination__item" aria-label="下一页" rel="next">
          <IconChevronRight size={18} strokeWidth={2} />
        </Link>
      ) : (
        <span className="apple-pagination__item" aria-disabled="true" aria-label="已是最后一页">
          <IconChevronRight size={18} strokeWidth={2} />
        </span>
      )}
    </nav>
  )
}
