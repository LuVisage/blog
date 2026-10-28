import Link from 'next/link'

export function TagBadge({ tag, count }: { tag: string; count?: number }) {
  return (
    <Link
      href={`/tags/${tag}`}
      className="capsule transition-colors"
    >
      #{tag}
      {count !== undefined && <span className="meta">{count}</span>}
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
