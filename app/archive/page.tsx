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

export default function ArchivePage() {
  const archive = getArchiveTree()
  const allPosts = getAllPosts()

  return (
    <div>
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <span className="gradient-text">归档</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {allPosts.length} 篇文章
          </p>
        </div>
      </AnimatedContent>

      {/* Calendar */}
      <AnimatedContent direction="up" delay={0.1}>
        <div className="mb-10">
          <PostsCalendar posts={allPosts} />
        </div>
      </AnimatedContent>

      {/* Timeline archive */}
      {archive.length > 0 ? (
        <div className="space-y-8">
          {archive.map(({ year, months }, yearIdx) => (
            <AnimatedContent
              key={year}
              direction="left"
              delay={yearIdx * 0.08}
            >
              <section>
                {/* Year header */}
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4 sticky top-20 z-10">
                  {year}
                </h2>

                <div className="space-y-6">
                  {months.map(({ month, posts }, monthIdx) => (
                    <AnimatedContent
                      key={month}
                      direction="up"
                      delay={(yearIdx * 3 + monthIdx) * 0.05}
                    >
                      <div className="rounded-2xl glass-card p-5 sm:p-6">
                        {/* Month header */}
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
                          {MONTH_NAMES[month - 1]}
                          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                            ({posts.length} 篇)
                          </span>
                        </h3>

                        {/* Post list */}
                        <div className="space-y-1">
                          {posts.map((post) => {
                            const date = new Date(post.date)
                            return (
                              <Link
                                key={post.slug}
                                href={`/posts/${post.slug}`}
                                className="flex items-center gap-3 px-3 py-2 -mx-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-200 group"
                              >
                                <time className="flex-shrink-0 text-xs text-gray-600 dark:text-gray-400 font-mono w-10">
                                  {format(date, 'd', { locale: zhCN })}日
                                </time>
                                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors truncate">
                                  {post.title}
                                </span>
                                {post.category && (
                                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-white/10 dark:border-white/10">
                                    {post.category}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </AnimatedContent>
                  ))}
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
