import Link from 'next/link'
import { IconTag } from '@tabler/icons-react'

export function TagBadge({ tag, count }: { tag: string; count?: number }) {
  return (
    <Link
      href={`/tags/${tag}`}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium glass transition-all hover:-translate-y-0.5"
      style={{ color: 'var(--color-body)' }}
    >
      <IconTag size={11} style={{ color: 'var(--color-primary)' }} strokeWidth={2.5} />
      {tag}
      {count !== undefined && (
        <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{count}</span>
      )}
    </Link>
  )
}

export function TagCloud({ tags }: { tags: { tag: string; count: number }[] }) {
  if (!tags.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => (
        <TagBadge key={tag} tag={tag} count={count} />
      ))}
    </div>
  )
}
