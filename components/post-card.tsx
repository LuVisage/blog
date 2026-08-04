import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { EmptyState } from '@/components/ui/empty-state'
import { IconFileText, IconClock, IconFolderFilled } from '@tabler/icons-react'

export function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`glass-liquid flex rounded-2xl group overflow-hidden ${
        featured ? 'lg:flex-row' : 'flex-col'
      }`}
    >
      {/* Left accent bar with gradient */}
      <div
        className={`flex-shrink-0 transition-all duration-300 group-hover:opacity-80 ${
          featured ? 'w-1.5' : 'w-1'
        }`}
        style={{ background: 'linear-gradient(180deg, var(--color-primary), rgba(124,92,231,0.3))' }}
      />

      <div className="flex flex-col p-5 sm:p-6 flex-1">
        {/* Top row: category + date */}
        <div className="flex items-center gap-2 mb-3">
          {post.category ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold glass-liquid"
              style={{ color: 'var(--color-primary)' }}
            >
              <IconFolderFilled size={10} />
              {post.category}
            </span>
          ) : (
            <span />
          )}
          {featured && (
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ color: 'var(--color-success)', background: 'rgba(16,185,129,0.14)' }}
            >
              精选
            </span>
          )}
          <span className="ml-auto text-[10px] font-mono" style={{ color: 'var(--color-muted-soft)' }}>
            {format(parseISO(post.date), 'M月d日', { locale: zhCN })}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-semibold mb-2 transition-colors duration-150 group-hover:text-[var(--color-primary)] ${
            featured ? 'text-xl' : 'text-base'
          }`}
          style={{ color: 'var(--color-ink)', fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {post.title}
        </h3>

        {/* Description */}
        {post.description && (
          <p
            className="text-sm line-clamp-2 mb-3 flex-1 leading-relaxed"
            style={{ color: 'var(--color-body)' }}
          >
            {post.description}
          </p>
        )}

        {/* Footer: reading time + tags count */}
        <div
          className="flex items-center justify-between pt-3 mt-auto caption"
          style={{ borderTop: '1px solid var(--color-hairline)' }}
        >
          <span className="flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
            <IconClock size={12} strokeWidth={1.5} />
            {post.readingTime} 分钟阅读
          </span>

          <div className="flex items-center gap-2">
            {post.tags.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full glass-liquid" style={{ color: 'var(--color-muted)' }}>
                {post.tags.length} 个标签
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} featured={featured && i === 0} />
      ))}
    </div>
  )
}
