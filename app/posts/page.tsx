import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getAllPosts, getPaginatedPosts } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { PageMasthead } from '@/components/page-masthead'
import { AnimatedContent } from '@/components/ui/animated-content'
import { IndexRail } from '@/components/index-rail'
import { Pagination } from '@/components/pagination'

export const metadata: Metadata = {
  title: '文章',
  description: `所有文章列表 - ${SITE.title}`,
  openGraph: {
    title: `文章 | ${SITE.title}`,
    description: `浏览 ${SITE.title} 上的所有文章`,
  },
}

export default function PostsPage() {
  const all = getAllPosts()
  const { posts, totalPages } = getPaginatedPosts(1, SITE.postsPerPage)

  return (
    <div>
      <PageMasthead
        eyebrow="文章 — Writing"
        title="全部文章"
        lead="按发布时间倒序排列，翻页继续往下读。"
        counter={`${all.length} 篇 · 最近 ${all[0]?.date.slice(0, 10) ?? '—'}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-12 lg:gap-16 items-start">
        <AnimatedContent direction="up" className="min-w-0">
          <PostList posts={posts} emptyHref={`${SITE.repo}/new/main/content/posts/`} />
          <Pagination current={1} total={totalPages} />
        </AnimatedContent>

        {/* 直接做 grid item：lg:sticky 要靠 items-start 的网格行高才有可滑动的余量，
            再包一层 div 会把吸顶范围压成内容高度（§11.12）。 */}
        <IndexRail />
      </div>
    </div>
  )
}
