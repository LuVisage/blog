import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllTags, getPostsByTag } from '@/lib/posts'
import { PostList } from '@/components/post-card'

type PageParams = Promise<{ tag: string }>

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: PageParams
}): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `${tag}`,
    description: `${SITE.title} 上关于"${tag}"的所有文章`,
  }
}

export default async function TagPage({ params }: { params: PageParams }) {
  const { tag } = await params
  const posts = getPostsByTag(tag)

  if (!posts.length) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">#{tag}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          共 {posts.length} 篇文章
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  )
}
