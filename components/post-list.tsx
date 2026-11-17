import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { EmptyState } from '@/components/ui/empty-state'
import { TypographicCover } from '@/components/typographic-cover'
import { IconFileText, IconArrowUpRight } from '@tabler/icons-react'

/**
 * 文章索引行 —— 编号 + 标题 + 日期/时长，刻意不做成卡片。
 * 原来这里还住着 FeatureCard / GridCard 两套封面卡（跟手光斑 + 封面视差），
 * 但五个调用点全都走默认行布局，卡片从未被渲染；第 18 轮把它们连同
 * .spotlight-card / .hover-zoom / .media-* 那几族 CSS 一起下线，
 * 这个文件也不再需要 'use client'：行里没有任何钩子与指针处理器。
 */

function shortDate(iso: string) {
  return format(parseISO(iso), 'yyyy.MM.dd', { locale: zhCN })
}

function IndexRow({ post, ordinal }: { post: PostMeta; ordinal: number }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      data-spotlight="row"
      className="group grid grid-cols-[44px_minmax(0,1fr)_auto] items-baseline gap-3 sm:gap-6 py-6 rule transition-colors"
    >
      {/* 封面预览钉在序号栏（globals.css §11.6 row-cover）：不再跟手，也就压不到正文。
          ZI 起是排字图版（标题首字），不再是 AI 封面缩略图。 */}
      <TypographicCover post={post} variant="mini" />

      {/* 第 5 轮换血：序号 → are.na 灰阶 mono 数字（无边框无胶囊），hover 让位给封面 */}
      <span className="issue-badge tabular-nums">{String(ordinal).padStart(2, '0')}</span>

      <div className="min-w-0">
        <h3
          className="row-shift row-title font-serif font-bold transition-colors group-hover:text-[var(--accent-text)] group-focus-visible:text-[var(--accent-text)] tint-ink"
          style={{ fontSize: 20, lineHeight: 1.4, letterSpacing: '-0.01em' }}
        >
          {post.title}
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
        {/* 箭头走 pl-6 预留的那 24px（left-0），不站在 right-0：日期与阅读时长都是
            右对齐贴到列的右边缘，箭头压在同一列上就会盖住字（390px 实测盖在日期中段）。
            键盘焦点与悬停共用同一套揭示条件，否则 Tab 用户只看到半套反馈。 */}
        <IconArrowUpRight
          size={16}
          strokeWidth={2}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 transition-[opacity,transform] duration-[300ms] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          style={{ color: 'var(--accent-text)' }}
        />
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
      <div className="stagger">
        {posts.map((post, i) => (
          <IndexRow key={post.slug} post={post} ordinal={i + 1} />
        ))}
      </div>
      <div className="rule" />
    </div>
  )
}