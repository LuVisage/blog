import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getArchiveTree, getAllPosts } from '@/lib/posts'
import { PostsCalendar } from '@/components/posts-calendar'
import { AnimatedContent } from '@/components/ui/animated-content'
import { StatsTile, StatsTileRow } from '@/components/ui/stats-tile'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'
import { IconArchive, IconPencil, IconArticle, IconWriting, IconCalendarStats, IconArrowRight } from '@tabler/icons-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export const metadata: Metadata = {
  title: '归档',
  description: `文章归档 - ${SITE.title}`,
}

const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

function TimelineDot({ count }: { count: number }) {
  const baseClasses = 'rounded-full flex-shrink-0 z-10'
  if (count >= 8) {
    return (
      <div
        className={`${baseClasses} w-3.5 h-3.5`}
        style={{
          background: 'var(--color-primary)',
          boxShadow: '0 0 0 3px var(--color-primary-soft), 0 0 10px rgba(124,92,231,0.25)',
        }}
      />
    )
  }
  if (count >= 4) {
    return (
      <div
        className={`${baseClasses} w-3 h-3`}
        style={{ background: 'var(--color-primary)', opacity: 0.7, boxShadow: '0 0 0 3px var(--color-primary-soft)' }}
      />
    )
  }
  return (
    <div
      className={`${baseClasses} w-2.5 h-2.5`}
      style={{ background: 'var(--color-primary)', opacity: 0.4, boxShadow: '0 0 0 3px var(--color-primary-soft)' }}
    />
  )
}

export default function ArchivePage() {
  const archive = getArchiveTree()
  const allPosts = getAllPosts()

  const totalPosts = allPosts.length
  const currentYear = new Date().getFullYear()
  const postsThisYear = allPosts.filter(p => p.date.startsWith(String(currentYear))).length

  return (
    <div>
      {/* Header */}
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3">
            <span className="gradient-text">文章归档</span>
          </h1>
          <p className="body-sm flex items-center gap-1.5">
            <IconArchive size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            共 <span className="font-bold mx-0.5" style={{ color: 'var(--color-ink)' }}>{totalPosts}</span> 篇文章，记录成长轨迹
          </p>
        </div>
      </AnimatedContent>

      {/* Stats Summary */}
      <AnimatedContent direction="up" delay={0.05}>
        <StatsTileRow>
          <StatsTile
            value={totalPosts}
            label="文章总数"
            icon={<IconArticle size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />}
          />
          <StatsTile
            value={postsThisYear}
            label={`${currentYear} 年`}
            icon={<IconCalendarStats size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />}
          />
          <StatsTile
            value={archive.length}
            label="写作年份"
            icon={<IconWriting size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />}
          />
          <StatsTile
            value={new Set(allPosts.map(p => p.date.slice(0, 7))).size}
            label="活跃月份"
            suffix="月"
            icon={<IconArchive size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />}
          />
        </StatsTileRow>
      </AnimatedContent>

      {/* Calendar heatmap */}
      <AnimatedContent direction="up" delay={0.1}>
        <div className="my-12">
          <PostsCalendar posts={allPosts} />
        </div>
      </AnimatedContent>

      {/* Timeline */}
      {archive.length > 0 ? (
        <div className="space-y-14">
          {archive.map(({ year, months }, yearIdx) => (
            <AnimatedContent key={year} direction="left" delay={yearIdx * 0.06}>
              <section className="relative">
                {/* Year header */}
                <div className="flex items-center gap-5 mb-8">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(124,92,231,0.3)',
                    }}
                  >
                    &apos;{String(year).slice(2)}
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--color-ink)' }}>
                      {year}
                    </h2>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-muted)' }}>
                      {months.reduce((sum, m) => sum + m.posts.length, 0)} 篇文章
                    </p>
                  </div>
                </div>

                {/* Timeline line + cards */}
                <div className="relative pl-8 sm:pl-12">
                  {/* Vertical line */}
                  <div
                    className="absolute left-[13px] sm:left-[15px] top-4 bottom-4 w-px"
                    style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-hairline), transparent)' }}
                  />

                  <div className="space-y-6">
                    {months.map(({ month, posts }) => (
                      <div key={month} className="relative">
                        {/* Dot on the timeline */}
                        <div className="absolute left-[-18px] sm:left-[-22px] top-5">
                          <TimelineDot count={posts.length} />
                        </div>

                        {/* Card */}
                        <div className="rounded-2xl glass-liquid p-4 sm:p-6" style={{ cursor: 'default' }}>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-ink)' }}>
                            {MONTH_NAMES[month - 1]}
                            <span className="text-sm font-normal" style={{ color: 'var(--color-muted)' }}>
                              · {posts.length} 篇
                            </span>
                          </h3>

                          <div className="space-y-0.5">
                            {posts.map((post) => {
                              const date = new Date(post.date)
                              return (
                                <Link
                                  key={post.slug}
                                  href={`/posts/${post.slug}`}
                                  className="flex items-center gap-3 sm:gap-4 px-3 py-2.5 -mx-3 rounded-xl transition-all duration-200 group hover:bg-[var(--color-primary-soft)]"
                                >
                                  <time
                                    className="flex-shrink-0 text-xs font-mono w-10 text-right"
                                    style={{ color: 'var(--color-muted)' }}
                                  >
                                    {format(date, 'M/d', { locale: zhCN })}
                                  </time>
                                  <span
                                    className="flex-1 text-sm font-medium truncate transition-colors group-hover:text-[var(--color-primary)]"
                                    style={{ color: 'var(--color-body)' }}
                                  >
                                    {post.title}
                                  </span>
                                  <IconArrowRight
                                    size={14}
                                    strokeWidth={2}
                                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
                                    style={{ color: 'var(--color-primary)' }}
                                  />
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </AnimatedContent>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IconArchive size={40} strokeWidth={1.5} style={{ color: 'var(--color-muted-soft)' }} />}
          title="还没有文章~"
          description="开始写作，让时间见证你的成长"
          action={{
            label: '写第一篇文章',
            icon: <IconPencil size={14} strokeWidth={1.5} />,
            href: 'https://github.com/LuVisage/blog/new/main/content/posts/',
          }}
        />
      )}
    </div>
  )
}
