import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllSeries } from '@/lib/posts'
import { AnimatedContent } from '@/components/ui/animated-content'
import { WobbleCard } from '@/components/ui/wobble-card'
import { EmptyState } from '@/components/ui/empty-state'
import { IconBooks, IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '系列',
  description: `系列文章 - ${SITE.title}`,
}

export default function SeriesPage() {
  const series = getAllSeries()

  return (
    <div>
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <span className="gradient-text">系列</span>
          </h1>
          <p className="body-sm">
            共 {series.length} 个系列
          </p>
        </div>
      </AnimatedContent>

      {series.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {series.map(({ series: name, count }, i) => (
            <AnimatedContent key={name} direction="up" delay={i * 0.06}>
              <WobbleCard intensity={4} gloss={true}>
              <Link
                href={`/series/${name}`}
                className="group rounded-2xl glass-card p-5 sm:p-6 block"
              >
                <div className="flex items-center gap-3 mb-2">
                  <IconBooks size={28} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
                  <h3 className="heading-3">{name}</h3>
                </div>
                <p className="body-sm">
                  共 {count} 篇文章
                </p>
                <div className="mt-3 flex items-center gap-1 caption group-hover:gap-2 transition-all">
                  <span>查看系列</span>
                  <IconArrowRight size={12} strokeWidth={2} />
                </div>
              </Link>
              </WobbleCard>
            </AnimatedContent>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IconBooks size={40} strokeWidth={1.5} style={{ color: 'var(--color-muted-soft)' }} />}
          title="还没有系列文章~"
          description="在文章 frontmatter 中添加 series 和 seriesOrder 字段"
        />
      )}
    </div>
  )
}
