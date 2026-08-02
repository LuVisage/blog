import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllCategories, getAllPosts } from '@/lib/posts'
import { AnimatedContent } from '@/components/ui/animated-content'
import { WobbleCard } from '@/components/ui/wobble-card'
import { EmptyState } from '@/components/ui/empty-state'
import { IconFolderFilled, IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '分类',
  description: `文章分类 - ${SITE.title}`,
}

export default function CategoriesPage() {
  const categories = getAllCategories()
  const allPosts = getAllPosts()

  const latestByCategory = new Map<string, { slug: string; title: string }>()
  allPosts.forEach(post => {
    if (post.category && !latestByCategory.has(post.category)) {
      latestByCategory.set(post.category, { slug: post.slug, title: post.title })
    }
  })

  return (
    <div>
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <span className="gradient-text">分类</span>
          </h1>
          <p className="body-sm flex items-center gap-1.5">
            <IconFolderFilled size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            共 {categories.length} 个分类
          </p>
        </div>
      </AnimatedContent>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(({ category, count }, i) => {
            const latest = latestByCategory.get(category)
            return (
              <AnimatedContent key={category} direction="up" delay={i * 0.05}>
                <WobbleCard intensity={4} gloss={true}>
                  <Link
                    href={`/categories/${category}`}
                    className="group rounded-2xl glass-card p-5 sm:p-6 block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-soft)' }}>
                        <IconFolderFilled size={20} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold glass" style={{ color: 'var(--color-ink)' }}>
                        {count}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>{category}</h3>
                    <p className="body-sm">{count} 篇文章</p>
                    {latest && (
                      <p className="text-xs mt-3 line-clamp-1 flex items-center gap-1.5 group-hover:text-[var(--color-primary)] transition-colors"
                        style={{ color: 'var(--color-muted)' }}>
                        <IconArrowRight size={12} strokeWidth={1.5} />
                        {latest.title}
                      </p>
                    )}
                  </Link>
                </WobbleCard>
              </AnimatedContent>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<IconFolderFilled size={40} strokeWidth={1.5} style={{ color: 'var(--color-muted-soft)' }} />}
          title="还没有分类~"
          description="在文章 frontmatter 中添加 category 字段"
        />
      )}
    </div>
  )
}
