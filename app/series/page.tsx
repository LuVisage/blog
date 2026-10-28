import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllSeries, getAllPosts } from '@/lib/posts'
import { PageMasthead } from '@/components/page-masthead'
import { LedgerRow, Ledger } from '@/components/ledger-row'
import { AnimatedContent } from '@/components/ui/animated-content'
import { EmptyState } from '@/components/ui/empty-state'
import { IconBooks } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: '系列',
  description: `系列文章 - ${SITE.title}`,
}

export default function SeriesPage() {
  const series = getAllSeries()
  const allPosts = getAllPosts()

  const startBySeries = new Map<string, string>()
  allPosts.forEach((post) => {
    if (post.series && !startBySeries.has(post.series)) {
      startBySeries.set(post.series, post.title)
    }
  })

  const total = series.reduce((sum, s) => sum + s.count, 0)

  return (
    <div>
      <PageMasthead
        eyebrow="系列 — Series"
        title="系列"
        lead="把同一个主题拆成多篇文章写完整，按顺序读效果最好。"
        counter={`${series.length} 个系列 · ${total} 篇文章`}
      />

      {series.length > 0 ? (
        <AnimatedContent direction="up">
          <div>
            <div className="eyebrow mb-5">索引</div>
            <Ledger>
              {series.map(({ series: name, count }, i) => (
                <LedgerRow
                  key={name}
                  ordinal={i + 1}
                  href={`/series/${name}`}
                  title={name}
                  label={startBySeries.get(name) ? `始于 ${startBySeries.get(name)}` : undefined}
                  meta={`${count} 篇`}
                />
              ))}
            </Ledger>
          </div>
        </AnimatedContent>
      ) : (
        <EmptyState
          icon={<IconBooks size={30} strokeWidth={1.25} />}
          title="还没有系列文章"
          description="在文章 frontmatter 中添加 series 和 seriesOrder 字段"
        />
      )}
    </div>
  )
}
