import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllCategories, getAllPosts } from '@/lib/posts'
import { PageMasthead } from '@/components/page-masthead'
import { LedgerRow, Ledger } from '@/components/ledger-row'
import { AnimatedContent } from '@/components/ui/animated-content'
import { EmptyState } from '@/components/ui/empty-state'
import { IconFolder } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: '分类',
  description: `文章分类 - ${SITE.title}`,
}

export default function CategoriesPage() {
  const categories = getAllCategories()
  const allPosts = getAllPosts()

  const latestByCategory = new Map<string, string>()
  allPosts.forEach((post) => {
    if (post.category && !latestByCategory.has(post.category)) {
      latestByCategory.set(post.category, post.title)
    }
  })

  return (
    <div>
      <PageMasthead
        eyebrow="分类 — Categories"
        title="分类"
        lead="文章按栏目归档，每个分类下是一组连续的思考。"
        counter={`${categories.length} 个分类 · ${allPosts.length} 篇文章`}
      />

      {categories.length > 0 ? (
        <AnimatedContent direction="up">
          <div>
            <div className="eyebrow mb-5">索引</div>
            <Ledger>
              {categories.map(({ category, count }, i) => (
                <LedgerRow
                  key={category}
                  ordinal={i + 1}
                  href={`/categories/${category}`}
                  title={category}
                  desc={latestByCategory.get(category) && `最新一篇 · ${latestByCategory.get(category)}`}
                  meta={`${count} 篇`}
                />
              ))}
            </Ledger>
          </div>
        </AnimatedContent>
      ) : (
        <EmptyState
          icon={<IconFolder size={30} strokeWidth={1.25} />}
          title="还没有分类"
          description="在文章 frontmatter 中添加 category 字段"
        />
      )}
    </div>
  )
}
