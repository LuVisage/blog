'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { EmptyState } from '@/components/ui/empty-state'
import { coverFor } from '@/lib/covers'
import { IconFileText, IconArrowUpRight } from '@tabler/icons-react'
import { ScrambleText } from '@/components/ui/scramble-text'

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
      className="group surface surface-hover hover-zoom spotlight-card grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] overflow-hidden"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
        // §11.7 封面视差：相对卡片中心偏移的 5%，随光标微移
        e.currentTarget.style.setProperty('--dx', `${(e.clientX - r.left - r.width / 2) * 0.05}px`)
        e.currentTarget.style.setProperty('--dy', `${(e.clientY - r.top - r.height / 2) * 0.05}px`)
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty('--dx', '0px')
        e.currentTarget.style.setProperty('--dy', '0px')
      }}
    >
      <div className="media-frame relative min-h-[190px] sm:min-h-[280px]">
        {/* 首屏封面用 eager + 同步解码：它是 LCP 元素；占位色由 .media-frame 铺在下面 */}
        <div className="media-parallax">
          <img src={cover.url} alt="" loading="eager" decoding="async" className="media-zoom" />
        </div>
        {/* indigo 签名左竖条（第 5 轮 +）：头条卡的强调色记忆点 */}
        <span
          className="absolute left-0 top-0 bottom-0 w-[3px] z-[1]"
          style={{ background: 'var(--color-primary)' }}
          aria-hidden="true"
        />
        <span className="absolute top-4 left-4 eyebrow eyebrow-accent">精选</span>
      </div>

      <div className="p-6 sm:p-10 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          {post.category && <span className="eyebrow">{post.category}</span>}
          <span className="meta">{shortDate(post.date)}</span>
        </div>

        <h3 className="heading-2 mb-3 transition-colors group-hover:text-[var(--accent-text)]">
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
      className="group grid grid-cols-[44px_minmax(0,1fr)_auto] items-baseline gap-3 sm:gap-6 py-6 rule transition-colors"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
      }}
    >
      {/* §11.6 封面跟手预览：hover 时封面小图沿光标滑出（reduced-motion 下直接显示） */}
      <img src={coverFor(post).url} alt="" loading="lazy" decoding="async" className="row-cover" />

      {/* 第 5 轮换血：序号 → are.na 灰阶 mono 数字（无边框无胶囊），hover 随行转 indigo */}
      <span className="issue-badge tabular-nums">{String(ordinal).padStart(2, '0')}</span>

      <div className="min-w-0">
        <h3
          className="row-shift font-serif font-bold truncate transition-colors group-hover:text-[var(--accent-text)]"
          style={{ fontSize: 20, lineHeight: 1.4, color: 'var(--ink)', letterSpacing: '-0.01em' }}
        >
          <ScrambleText text={post.title} />
        </h3>
        {post.description && (
          <p className="body-sm line-clamp-1 mt-1.5">{post.description}</p>
        )}
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

      <div className="text-right flex-shrink-0 relative pl-6">
        <div className="meta transition-opacity group-hover:opacity-60">{shortDate(post.date)}</div>
        <div className="caption mt-1 transition-opacity group-hover:opacity-60">{post.readingTime} 分钟</div>
        <IconArrowUpRight
          size={16}
          strokeWidth={2}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 opacity-0 transition-all duration-[300ms] group-hover:translate-x-0 group-hover:opacity-100"
          style={{ color: 'var(--accent-text)' }}
        />
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
      className="group surface surface-hover hover-zoom spotlight-card flex flex-col overflow-hidden"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
        e.currentTarget.style.setProperty('--dx', `${(e.clientX - r.left - r.width / 2) * 0.05}px`)
        e.currentTarget.style.setProperty('--dy', `${(e.clientY - r.top - r.height / 2) * 0.05}px`)
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty('--dx', '0px')
        e.currentTarget.style.setProperty('--dy', '0px')
      }}
    >
      <div className="media-frame h-28 sm:h-32">
        {/* 网格卡多在首屏之外：懒加载 + 异步解码，占位色先撑住版面 */}
        <div className="media-parallax">
          <img src={cover.url} alt="" loading="lazy" decoding="async" className="media-zoom" />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
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
        <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(lead ? rest : posts).map((post) => <GridCard key={post.slug} post={post} />)}
        </div>
      ) : (
        <div>
          <div className="stagger">
            {(lead ? rest : posts).map((post, i) => (
              <IndexRow key={post.slug} post={post} ordinal={i + 1} />
            ))}
          </div>
          <div className="rule" />
        </div>
      )}
    </>
  )
}
