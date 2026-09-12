import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllSeries, getPostsBySeries } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { PageMasthead } from '@/components/page-masthead'
import { IconArrowLeft } from '@tabler/icons-react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type PageParams = Promise<{ series: string }>

export function generateStaticParams(): Array<{ series: string }> {
  return getAllSeries().map(({ series }) => ({ series }))
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
  const others = getAllSeries().filter((s) => s.series !== series)

  if (!posts.length) notFound()

  const totalMinutes = posts.reduce((sum, p) => sum + p.readingTime, 0)
  const last = posts[posts.length - 1]

  return (
    <div>
      <PageMasthead
        eyebrow="系列 — Series"
        title={series}
        lead={`${SITE.title} 上「${series}」系列的全部文章，下面的编号即推荐阅读顺序。`}
        counter={`${posts.length} 篇 · 约 ${totalMinutes} 分钟`}
      />

      <div className="flex flex-wrap items-center gap-2 mb-10 pb-5" style={{ borderBottom: '1px solid var(--line)' }}>
        <Link href="/series" className="btn-ghost text-sm h-9">
          <IconArrowLeft size={14} strokeWidth={2} />
          全部系列
        </Link>
        <span className="meta ml-auto">最近更新 {format(parseISO(last.date), 'yyyy.MM.dd', { locale: zhCN })}</span>
      </div>

      {others.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-1.5 mb-10">
          <span className="eyebrow self-center mr-1">其他系列</span>
          {others.slice(0, 6).map(({ series: other }) => (
            <Link
              key={other}
              href={`/series/${other}`}
              className="chip px-2.5 py-1 text-xs transition-colors hover:border-[var(--accent-line)]"
              style={{ color: 'var(--muted)' }}
            >
              {other}
            </Link>
          ))}
        </div>
      )}

      <PostList posts={posts} />
    </div>
  )
}
