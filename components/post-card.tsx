import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { EmptyState } from '@/components/ui/empty-state'
import { IconFileText, IconClock, IconCircleFilled } from '@tabler/icons-react'

function PipelineDot({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center" title={color}>
      <IconCircleFilled size={6} style={{ color }} />
    </span>
  )
}

export function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean; index?: number }) {
  const date = parseISO(post.date)

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`glass-card flex rounded-2xl group overflow-hidden ${
        featured ? 'lg:flex-row' : 'flex-col'
      }`}
    >
      {/* Pipeline spine (left accent bar) */}
      <div
        className={`flex-shrink-0 transition-colors duration-300 ${
          featured ? 'w-1.5' : 'w-1'
        }`}
        style={{ background: 'var(--color-primary)' }}
      />

      <div className="flex flex-col p-5 sm:p-6 flex-1">
        {/* Top row: category + date + pipeline dots */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {post.category ? (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold glass"
                style={{ color: 'var(--color-body)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                {post.category}
              </span>
            ) : (
              <span />
            )}
            {featured && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)' }}
              >
                精选
              </span>
            )}
          </div>

          {/* Pipeline dots (right side) */}
          <div className="flex items-center gap-0.5">
            <PipelineDot color="var(--color-primary)" />
            <PipelineDot color={post.readingTime > 5 ? 'var(--color-accent-gold)' : 'var(--color-success)'} />
            <PipelineDot color={post.tags.length > 2 ? 'var(--color-primary)' : 'var(--color-hairline)'} />
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-semibold mb-2 transition-colors duration-150 ${
            featured ? 'text-xl' : 'text-base'
          }`}
          style={{ color: 'var(--color-ink)', fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {post.title}
        </h3>

        {/* Description */}
        {post.description && (
          <p
            className={`line-clamp-2 mb-4 flex-1 ${featured ? 'text-sm' : 'text-sm'}`}
            style={{ color: 'var(--color-body)' }}
          >
            {post.description}
          </p>
        )}

        {/* Footer: time + tags */}
        <div
          className="flex items-center justify-between pt-3 mt-auto caption"
          style={{ borderTop: '1px solid var(--color-hairline)' }}
        >
          <span className="flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
            <IconClock size={12} strokeWidth={1.5} />
            {post.readingTime} 分钟
          </span>

          <div className="flex items-center gap-1.5">
            <time dateTime={post.date} className="text-xs font-mono" style={{ color: 'var(--color-muted-soft)' }}>
              {format(date, 'M月d日', { locale: zhCN })}
            </time>
            {post.tags.length > 0 && (
              <span className="text-[10px]" style={{ color: 'var(--color-muted-soft)' }}>
                · {post.tags.length} 标签
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function PostList({ posts, featured = false }: { posts: PostMeta[]; featured?: boolean }) {
  if (!posts.length) {
    return (
      <EmptyState
        icon={<IconFileText size={36} style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />}
        title="还没有文章哦~"
        description="写点什么吧，期待你的第一篇博文"
        action={{ label: '发布文章', href: 'https://github.com/LuVisage/blog/new/main/content/posts/' }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} featured={featured && i === 0} />
      ))}
    </div>
  )
}
