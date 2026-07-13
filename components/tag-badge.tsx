import Link from 'next/link'

export function TagBadge({ tag, count }: { tag: string; count?: number }) {
  return (
    <Link
      href={`/tags/${tag}`}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 hover:border-pink-400 dark:hover:border-pink-400 hover:shadow-sm hover:shadow-pink-200/50 dark:hover:shadow-pink-900/20 transition-all hover:-translate-y-0.5"
    >
      <span className="text-[10px]">✦</span>
      {tag}
      {count !== undefined && (
        <span className="text-pink-400 dark:text-pink-500 text-[10px]">{count}</span>
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
