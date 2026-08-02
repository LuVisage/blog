import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllTags, getPostsByTag } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { TagCloud } from '@/components/tag-badge'
import { IconTag } from '@tabler/icons-react'

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
  const allTags = getAllTags()

  if (!posts.length) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">#{tag}</span>
        </h1>
        <p className="body-sm flex items-center gap-1.5">
          <IconTag size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          共 {posts.length} 篇文章
        </p>
      </div>

      {/* All tags quick nav */}
      <div className="mb-8">
        <TagCloud tags={allTags} />
      </div>

      <PostList posts={posts} />
    </div>
  )
}
