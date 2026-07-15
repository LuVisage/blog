import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllSeries, getPostsBySeries } from '@/lib/posts'
import { PostList } from '@/components/post-card'

type PageParams = Promise<{ series: string }>

export function generateStaticParams() {
  try {
    return getAllSeries().map(({ series }) => ({ series }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { series } = await params
  return {
    title: `系列：${series}`,
    description: `${SITE.title} 上"${series}"系列的所有文章`,
  }
}

export default async function SeriesDetailPage({ params }: { params: PageParams }) {
  const { series } = await params
  const posts = getPostsBySeries(series)

  if (!posts.length) notFound()

  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="gradient-text">{series}</span>
          </h1>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          共 {posts.length} 篇文章
        </p>
      </div>

      {/* Series outline */}
      <div className="rounded-2xl glass-card p-5 sm:p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          系列目录
        </h3>
        <div className="space-y-0.5">
          {posts.map((post, i) => (
            <a
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex items-center gap-3 px-3 py-2 -mx-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-colors group"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-xs font-bold flex items-center justify-center">
                {post.seriesOrder ?? i + 1}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors truncate">
                {post.title}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(post.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            </a>
          ))}
        </div>
      </div>

      <PostList posts={posts} />
    </div>
  )
}
