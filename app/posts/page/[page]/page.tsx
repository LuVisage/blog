import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllPosts, getPaginatedPosts } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { PageMasthead } from '@/components/page-masthead'
import { AnimatedContent } from '@/components/ui/animated-content'
import { IndexRail } from '@/components/index-rail'
import { Pagination } from '@/components/pagination'

type PageParams = Promise<{ page: string }>

/** 第 1 页是 /posts/，静态导出只补第 2 页往后。 */
export function generateStaticParams() {
  const totalPages = Math.ceil(getAllPosts().length / SITE.postsPerPage)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }))
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { page } = await params
  return {
    title: `文章 · 第 ${page} 页`,
    description: `${SITE.title} 的文章列表，第 ${page} 页`,
  }
}

export default async function PostsPagedPage({ params }: { params: PageParams }) {
  const { page } = await params
  const current = Number(page)
  if (!Number.isInteger(current) || current < 2) notFound()

  const all = getAllPosts()
  const { posts, totalPages } = getPaginatedPosts(current, SITE.postsPerPage)
  if (current > totalPages || posts.length === 0) notFound()

  return (
    <div>
      <PageMasthead
        eyebrow="文章 — Writing"
        title={`全部文章 · 第 ${current} 页`}
        lead="按发布时间倒序排列，翻页继续往下读。"
        counter={`${all.length} 篇 · 第 ${current} / ${totalPages} 页`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-12 lg:gap-16 items-start">
        <AnimatedContent direction="up" className="min-w-0">
          <PostList posts={posts} emptyHref={`${SITE.repo}/new/main/content/posts/`} />
          <Pagination current={current} total={totalPages} />
        </AnimatedContent>
        <IndexRail />
      </div>
    </div>
  )
}
