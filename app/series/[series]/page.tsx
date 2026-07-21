import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllSeries, getPostsBySeries } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { IconBooks, IconList } from '@tabler/icons-react'

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
          <IconBooks size={32} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="gradient-text">{series}</span>
          </h1>
        </div>
        <p className="body-sm">
          共 {posts.length} 篇文章
        </p>
      </div>

      {/* Series outline */}
      <div className="rounded-2xl glass-card p-5 sm:p-6 mb-8">
        <h3 className="heading-3 mb-3 flex items-center gap-2">
          <IconList size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          系列目录
        </h3>
        <div className="space-y-0.5">
          {posts.map((post, i) => (
            <a
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex items-center gap-3 px-3 py-2 -mx-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors group"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full glass text-xs font-bold flex items-center justify-center" style={{ color: 'var(--color-ink)' }}>
                {post.seriesOrder ?? i + 1}
              </span>
              <span className="flex-1 text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--color-body)' }}>
                {post.title}
              </span>
              <span className="caption">
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
