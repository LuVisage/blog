import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllSeries, getPostsBySeries } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { IconBooks, IconList, IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-soft)' }}>
            <IconBooks size={22} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="gradient-text">{series}</span>
          </h1>
        </div>
        <p className="body-sm flex items-center gap-1.5">
          <IconList size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          共 {posts.length} 篇文章
        </p>
      </div>

      {/* Series outline */}
      <div className="rounded-2xl glass-card p-5 sm:p-6 mb-8" style={{ cursor: 'default' }}>
        <h3 className="heading-3 mb-4 flex items-center gap-2">
          <IconList size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          系列目录
        </h3>
        <div className="space-y-0.5">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-xl hover:bg-[var(--color-primary-soft)] transition-all duration-200 group"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-lg glass text-xs font-bold flex items-center justify-center font-mono" style={{ color: 'var(--color-ink)' }}>
                {post.seriesOrder ?? i + 1}
              </span>
              <span className="flex-1 text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--color-body)' }}>
                {post.title}
              </span>
              <span className="caption flex-shrink-0">
                {new Date(post.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
              <IconArrowRight
                size={14}
                strokeWidth={2}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
                style={{ color: 'var(--color-primary)' }}
              />
            </Link>
          ))}
        </div>
      </div>

      <PostList posts={posts} />
    </div>
  )
}
