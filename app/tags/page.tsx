import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { TagFilter } from '@/components/tag-filter'

export const metadata: Metadata = {
  title: '标签',
  description: `文章标签 - ${SITE.title}`,
}

export default function TagsPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return <TagFilter posts={posts} tags={tags} />
}
