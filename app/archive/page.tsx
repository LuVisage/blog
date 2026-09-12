import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getArchiveTree, getAllPosts } from '@/lib/posts'
import { PostsCalendar } from '@/components/posts-calendar'
import { PageMasthead } from '@/components/page-masthead'
import { AnimatedContent } from '@/components/ui/animated-content'
import { StatsTile, StatsTileRow } from '@/components/ui/stats-tile'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'
import { IconArchive, IconPencil } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export const metadata: Metadata = {
  title: '归档',
  description: `文章归档 - ${SITE.title}`,
}

const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

export default function ArchivePage() {
  const archive = getArchiveTree()
  const allPosts = getAllPosts()

  const totalPosts = allPosts.length
  const currentYear = new Date().getFullYear()
  const postsThisYear = allPosts.filter((p) => p.date.startsWith(String(currentYear))).length
  const activeMonths = new Set(allPosts.map((p) => p.date.slice(0, 7))).size

  return (
    <div>
      <PageMasthead
        eyebrow="归档 — Archive"
        title="文章归档"
        lead="按时间排下来的全部文章。"
        counter={`${totalPosts} 篇 · ${archive.length} 个年份`}
      />

      <AnimatedContent direction="up">
        <div className="mb-14">
          <div className="eyebrow mb-5">总览</div>
          <StatsTileRow>
            <StatsTile value={totalPosts} label="文章总数" />
            <StatsTile value={postsThisYear} label={`${currentYear} 年`} />
            <StatsTile value={archive.length} label="写作年份" />
            <StatsTile value={activeMonths} label="活跃月份" suffix="月" />
          </StatsTileRow>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="up" delay={0.06}>
        <section className="mb-16">
          <div className="eyebrow mb-2">分布</div>
          <h2 className="section-title mb-6">写作日历</h2>
          <PostsCalendar posts={allPosts} />
        </section>
      </AnimatedContent>

      {archive.length > 0 ? (
        <div className="space-y-16">
          {archive.map(({ year, months }, yearIdx) => {
            const yearCount = months.reduce((sum, m) => sum + m.posts.length, 0)
            return (
              <AnimatedContent key={year} direction="up" delay={yearIdx * 0.05}>
                <section>
                  <div
                    className="flex items-end justify-between gap-4 pb-3 mb-2"
                    style={{ borderBottom: '1px solid var(--line-strong)' }}
                  >
                    <h2
                      className="font-serif font-bold"
                      style={{
                        fontSize: 'clamp(30px, 5vw, 46px)',
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        color: 'var(--ink)',
                      }}
                    >
                      {year}
                    </h2>
                    <span className="eyebrow mb-1.5">{yearCount} 篇</span>
                  </div>

                  {months.map(({ month, posts }) => (
                    <div
                      key={month}
                      className="grid grid-cols-1 md:grid-cols-[92px_minmax(0,1fr)] gap-x-10"
                    >
                      <div className="eyebrow pt-6 md:pt-[26px]">{MONTH_NAMES[month - 1]}</div>
                      <div>
                        {posts.map((post) => (
                          <Link
                            key={post.slug}
                            href={`/posts/${post.slug}`}
                            data-spotlight="row"
                            className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-4 sm:gap-6 py-4 rule"
                          >
                            <time
                              className="meta tabular-nums w-9 text-right transition-colors group-hover:text-[var(--accent-text)]"
                              dateTime={post.date}
                            >
                              {format(parseISO(post.date), 'M/d', { locale: zhCN })}
                            </time>
                            <span
                              className="font-serif font-bold truncate transition-colors group-hover:text-[var(--accent-text)]"
                              style={{ fontSize: 17, lineHeight: 1.45, color: 'var(--ink)' }}
                            >
                              {post.title}
                            </span>
                            <span className="caption flex-shrink-0">{post.readingTime} 分钟</span>
                          </Link>
                        ))}
                        <div className="rule" />
                      </div>
                    </div>
                  ))}
                </section>
              </AnimatedContent>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<IconArchive size={30} strokeWidth={1.25} />}
          title="还没有文章"
          description="开始写作，让时间见证你的成长"
          action={{
            label: '写第一篇文章',
            icon: <IconPencil size={14} strokeWidth={1.75} />,
            href: `${SITE.repo}/new/main/content/posts/`,
          }}
        />
      )}
    </div>
  )
}
