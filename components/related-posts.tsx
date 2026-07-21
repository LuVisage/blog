import { getRelatedPosts } from '@/lib/posts'
import { PostCard } from './post-card'

interface RelatedPostsProps {
  currentSlug: string
}

export function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  const related = getRelatedPosts(currentSlug, 3)
  if (related.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="section-title mb-6">相关文章</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
