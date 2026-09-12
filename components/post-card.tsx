import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { EmptyState } from '@/components/ui/empty-state'
import { coverFor } from '@/lib/covers'
import { IconFileText, IconArrowUpRight } from '@tabler/icons-react'

type Layout = 'index' | 'grid' | 'feature'

function shortDate(iso: string) {
  return format(parseISO(iso), 'yyyy.MM.dd', { locale: zhCN })
}

/** Full-width lead story: cover left, serif headline right. */
export function FeatureCard({ post }: { post: PostMeta }) {
  const cover = coverFor(post)
  return (
    <Link
      href={`/posts/${post.slug}`}
      data-spotlight=""
      data-tilt="2"
      className="group surface surface-hover grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] overflow-hidden"
      style={{ borderRadius: 14 }}
    >
      <div
        className="relative min-h-[190px] sm:min-h-[280px] bg-cover bg-center"
        style={{ backgroundImage: `url("${cover.url}")` }}
      >
        <span className="absolute top-4 left-4 eyebrow eyebrow-accent">精选</span>
      </div>

      <div className="p-6 sm:p-9 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          {post.category && <span className="eyebrow">{post.category}</span>}
          <span className="meta">{shortDate(post.date)}</span>
        </div>

        <h3
          className="heading-2 mb-3 transition-colors group-hover:text-[var(--accent-text)]"
          style={{ fontSize: 'clamp(22px, 3.2vw, 30px)', lineHeight: 1.28 }}
        >
          {post.title}
        </h3>

        {post.description && (
          <p className="body-md line-clamp-3 flex-1">{post.description}</p>
        )}

        <div className="flex items-center gap-4 mt-6 pt-5 rule">
          <span className="meta">{post.readingTime} 分钟</span>
          {post.tags.length > 0 && (
            <span className="meta truncate flex-1">
              {post.tags.slice(0, 3).map((t) => `#${t}`).join('  ')}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 text-xs font-medium transition-colors group-hover:text-[var(--accent-text)]"
            style={{ color: 'var(--muted)' }}
          >
            阅读
            <IconArrowUpRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Numbered row — the editorial index. Deliberately not a card. */
function IndexRow({ post, ordinal }: { post: PostMeta; ordinal: number }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      data-spotlight="row"
      className="group grid grid-cols-[36px_minmax(0,1fr)_auto] items-baseline gap-3 sm:gap-6 py-6 rule transition-colors"
    >
      <span className="meta tabular-nums transition-colors group-hover:text-[var(--accent-text)]">
        {String(ordinal).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <h3
          className="font-serif font-bold truncate transition-colors group-hover:text-[var(--accent-text)]"
          style={{ fontSize: 20, lineHeight: 1.4, color: 'var(--ink)', letterSpacing: '-0.01em' }}
        >
          {post.title}
        </h3>
        {post.description && (
          <p className="body-sm line-clamp-1 mt-1.5">{post.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2.5">
          {post.category && <span className="eyebrow">{post.category}</span>}
          {post.tags.length > 0 && (
            <span className="meta truncate hidden sm:inline">
              {post.tags.slice(0, 4).map((t) => `#${t}`).join('  ')}
            </span>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="meta">{shortDate(post.date)}</div>
        <div className="caption mt-1">{post.readingTime} 分钟</div>
      </div>
    </Link>
  )
}

/** Compact card for dense grids. */
function GridCard({ post }: { post: PostMeta }) {
  const cover = coverFor(post)
  return (
    <Link
      href={`/posts/${post.slug}`}
      data-spotlight=""
      data-tilt="4"
      className="group surface surface-hover flex flex-col overflow-hidden"
    >
      <div
        className="h-28 sm:h-32 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04]"
        style={{ backgroundImage: `url("${cover.url}")` }}
      />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          {post.category && <span className="eyebrow">{post.category}</span>}
          <span className="meta ml-auto">{shortDate(post.date)}</span>
        </div>
        <h3
          className="font-serif font-bold mb-2 line-clamp-2 transition-colors group-hover:text-[var(--accent-text)]"
          style={{ fontSize: 17, lineHeight: 1.4, color: 'var(--ink)' }}
        >
          {post.title}
        </h3>
        {post.description && <p className="body-sm line-clamp-2 flex-1">{post.description}</p>}
        <div className="meta mt-4 pt-3 rule">{post.readingTime} 分钟</div>
      </div>
    </Link>
  )
}

export function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return featured ? <FeatureCard post={post} /> : <GridCard post={post} />
}

interface PostListProps {
  posts: PostMeta[]
  layout?: Layout
  /** Lead story rendered as a full-width feature above the list. */
  lead?: boolean
  emptyHref?: string
}

export function PostList({ posts, layout = 'index', lead = false, emptyHref }: PostListProps) {
  if (!posts.length) {
    return (
      <EmptyState
        icon={<IconFileText size={36} strokeWidth={1.5} style={{ color: 'var(--accent-text)' }} />}
        title="还没有文章哦~"
        description="写点什么吧，期待你的第一篇博文"
        action={emptyHref ? { label: '发布文章', href: emptyHref } : undefined}
      />
    )
  }

  const [first, ...rest] = posts

  return (
    <>
      {lead && <FeatureCard post={first} />}

      {layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(lead ? rest : posts).map((post) => <GridCard key={post.slug} post={post} />)}
        </div>
      ) : (
        <div>
          {(lead ? rest : posts).map((post, i) => (
            <IndexRow key={post.slug} post={post} ordinal={i + 1} />
          ))}
          <div className="rule" />
        </div>
      )}
    </>
  )
}
