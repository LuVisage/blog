import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllPosts, getPaginatedPosts } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { Pagination } from '@/components/pagination'
import { AnimatedContent } from '@/components/ui/animated-content'
import { BlurText } from '@/components/ui/blur-text'

export const metadata: Metadata = {
  title: '文章',
  description: `所有文章列表 - ${SITE.title}`,
  openGraph: {
    title: `文章 | ${SITE.title}`,
    description: `浏览 ${SITE.title} 上的所有文章`,
  },
}

export default function PostsPage() {
  const { posts, totalPages, currentPage } = getPaginatedPosts(1, SITE.postsPerPage)
  const totalPosts = getAllPosts().length

  return (
    <div>
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <BlurText
              text="文章"
              duration={0.04}
              delay={0.1}
              as="span"
              className="gradient-text"
            />
          </h1>
          <p className="body-sm lg:text-base">
            共 {totalPosts} 篇文章
          </p>
        </div>
      </AnimatedContent>

      <PostList posts={posts} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/posts"
      />
    </div>
  )
}
