import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getArchiveTree, getAllPosts } from '@/lib/posts'
import { PostsCalendar } from '@/components/posts-calendar'
import { AnimatedContent } from '@/components/ui/animated-content'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'
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

/** Timeline dot component — colored by post count */
function TimelineDot({ count, yearColor }: { count: number; yearColor: string }) {
  if (count >= 8) {
    return <div className="w-3.5 h-3.5 rounded-full bg-gray-700 dark:bg-gray-300 ring-2 ring-gray-400/30 dark:ring-gray-500/30 ring-offset-2 ring-offset-white/80 dark:ring-offset-black/50 flex-shrink-0 z-10" />
  }
  if (count >= 4) {
    return <div className="w-3 h-3 rounded-full bg-gray-500 dark:bg-gray-400 ring-2 ring-gray-400/20 dark:ring-gray-500/20 ring-offset-2 ring-offset-white/80 dark:ring-offset-black/50 flex-shrink-0 z-10" />
  }
  return <div className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500 ring-2 ring-gray-300/20 dark:ring-gray-500/20 ring-offset-2 ring-offset-white/80 dark:ring-offset-black/50 flex-shrink-0 z-10" />
}

export default function ArchivePage() {
  const archive = getArchiveTree()
  const allPosts = getAllPosts()

  return (
    <div>
      <AnimatedContent direction="up">
        <div className="mb-10 lg:mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3">
            <span className="gradient-text">文章归档</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            📝 共 <span className="font-bold text-gray-800 dark:text-gray-200">{allPosts.length}</span> 篇文章，记录成长轨迹
          </p>
        </div>
      </AnimatedContent>

      {/* Calendar heatmap */}
      <AnimatedContent direction="up" delay={0.1}>
        <div className="mb-12">
          <PostsCalendar posts={allPosts} />
        </div>
      </AnimatedContent>

      {/* Timeline — vertical line with month cards */}
      {archive.length > 0 ? (
        <div className="space-y-10">
          {archive.map(({ year, months }, yearIdx) => (
            <AnimatedContent key={year} direction="left" delay={yearIdx * 0.08}>
              <section className="relative">
                {/* Year header with accent */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-800 dark:bg-white/10 flex items-center justify-center text-white dark:text-gray-200 text-xl sm:text-2xl font-bold shadow-lg shadow-black/10 dark:shadow-black/30">
                    {String(year).slice(2)}
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
                      {year}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {months.reduce((sum, m) => sum + m.posts.length, 0)} 篇文章
                    </p>
                  </div>
                </div>

                {/* Timeline line + cards */}
                <div className="relative pl-8 sm:pl-10">
                  {/* Vertical line */}
                  <div className="absolute left-[13px] sm:left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-gray-300/60 via-gray-300/40 to-transparent dark:from-gray-600/40 dark:via-gray-600/20 dark:to-transparent" />

                  <div className="space-y-6">
                    {months.map(({ month, posts }, monthIdx) => (
                      <div
                        key={month}
                        className="relative"
                        style={{ animationDelay: `${(yearIdx * 3 + monthIdx) * 0.05}s` }}
                      >
                        {/* Dot on the timeline */}
                        <div className="absolute left-[-22px] sm:left-[-25px] top-5">
                          <TimelineDot count={posts.length} yearColor="" />
                        </div>

                        {/* Card */}
                        <div className="rounded-2xl glass-card p-4 sm:p-6 animate-scale-in">
                          {/* Month header */}
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span>{MONTH_NAMES[month - 1]}</span>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              · {posts.length} 篇
                            </span>
                          </h3>

                          {/* Post list with hover highlights */}
                          <div className="space-y-1">
                            {posts.map((post) => {
                              const date = new Date(post.date)
                              return (
                                <Link
                                  key={post.slug}
                                  href={`/posts/${post.slug}`}
                                  className="flex items-center gap-3 sm:gap-4 px-3 py-2.5 -mx-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-200 group"
                                >
                                  <time className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 font-mono w-10 text-right">
                                    {format(date, 'M/d', { locale: zhCN })}
                                  </time>
                                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors truncate">
                                    {post.title}
                                  </span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform">
                                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                  </svg>
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
          icon="📦"
          title="还没有文章~"
          description="开始写作，让时间见证你的成长 ✨"
          action={{
            label: '✏️ 写第一篇文章',
            href: 'https://github.com/LuVisage/blog/new/main/content/posts/',
          }}
        />
      )}
    </div>
  )
}
