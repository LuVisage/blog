import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllCategories, getPostsByCategory } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { PageMasthead } from '@/components/page-masthead'
import { IconArrowLeft } from '@tabler/icons-react'

type PageParams = Promise<{ category: string }>

export function generateStaticParams(): Array<{ category: string }> {
  const categories = getAllCategories()
  return categories.map(({ category }) => ({ category }))
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { category } = await params
  return {
    title: `${category}`,
    description: `${SITE.title} 上"${category}"分类下的所有文章`,
  }
}

export default async function CategoryPage({ params }: { params: PageParams }) {
  const { category } = await params
  const posts = getPostsByCategory(category)
  const others = getAllCategories().filter((c) => c.category !== category)

  if (!posts.length) notFound()

  return (
    <div>
      <PageMasthead
        eyebrow="分类 — Category"
        title={category}
        lead={`${SITE.title} 上「${category}」分类下的全部文章。`}
        counter={`${posts.length} 篇`}
      />

      <div className="mb-10 flex items-center gap-2">
        <Link href="/categories" className="btn-ghost text-sm h-9">
          <IconArrowLeft size={14} strokeWidth={2} />
          全部分类
        </Link>
        {others.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1.5 ml-2">
            {others.slice(0, 5).map(({ category: other }) => (
              <Link
                key={other}
                href={`/categories/${other}`}
                className="chip px-2.5 py-1 text-xs transition-colors hover:border-[var(--accent-line)]"
                style={{ color: 'var(--muted)' }}
              >
                {other}
              </Link>
            ))}
          </div>
        )}
      </div>

      <PostList posts={posts} />
    </div>
  )
}
