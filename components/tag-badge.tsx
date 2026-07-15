import Link from 'next/link'

export function TagBadge({ tag, count }: { tag: string; count?: number }) {
  return (
    <Link
      href={`/tags/${tag}`}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-white/10 to-white/5 dark:from-white/5 dark:to-white/5 text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/10 hover:shadow-sm hover:shadow-black/10 dark:hover:shadow-black/10 transition-all hover:-translate-y-0.5"
    >
      <span className="text-[10px]">✦</span>
      {tag}
      {count !== undefined && (
        <span className="text-gray-600 dark:text-gray-400 text-[10px]">{count}</span>
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
