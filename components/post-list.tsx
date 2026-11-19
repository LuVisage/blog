import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { IconFileText } from '@tabler/icons-react'
import type { PostMeta } from '@/lib/posts'
import { EmptyState } from '@/components/ui/empty-state'

function IndexRow({ post, ordinal }: { post: PostMeta; ordinal: number }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group grid grid-cols-[28px_minmax(0,1fr)_auto] items-baseline gap-3 sm:gap-6 py-6 rule transition-colors"
    >
      <span className="issue-badge tabular-nums">{String(ordinal).padStart(2, '0')}</span>

      <div className="min-w-0">
        <h3
          className="row-title font-serif font-bold transition-colors group-hover:text-[var(--accent-text)] group-focus-visible:text-[var(--accent-text)] tint-ink"
          style={{ fontSize: 21, lineHeight: 1.4, letterSpacing: '-0.015em' }}
        >
          {post.title}
        </h3>
        {post.description && <p className="body-sm line-clamp-1 mt-1.5">{post.description}</p>}
        <div className="flex items-center gap-3 mt-2.5">
          {post.category && <span className="eyebrow">{post.category}</span>}
          {post.tags.length > 0 && (
            <span className="hidden sm:flex items-center gap-1.5">
              {post.tags.slice(0, 3).map((t) => (
                <span key={t} className="capsule">#{t}</span>
              ))}
            </span>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="meta transition-opacity group-hover:opacity-60">
          {format(parseISO(post.date), 'yyyy.MM.dd', { locale: zhCN })}
        </div>
        <div className="caption mt-1 transition-opacity group-hover:opacity-60">{post.readingTime} 分钟</div>
      </div>
    </Link>
  )
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) {
    return (
      <EmptyState
        icon={<IconFileText size={36} strokeWidth={1.5} style={{ color: 'var(--accent-text)' }} />}
        title="还没有文章"
        description="文章发出后会按时间列在这里"
      />
    )
  }

  return (
    <div>
      {posts.map((post, i) => (
        <IndexRow key={post.slug} post={post} ordinal={i + 1} />
      ))}
      <div className="rule" />
    </div>
  )
}
