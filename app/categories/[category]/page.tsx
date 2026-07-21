import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllCategories, getPostsByCategory } from '@/lib/posts'
import { PostList } from '@/components/post-card'

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

  if (!posts.length) notFound()

  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">{category}</span>
        </h1>
        <p className="body-sm">
          共 {posts.length} 篇文章
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  )
}
