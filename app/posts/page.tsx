import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/constants'
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { PageMasthead } from '@/components/page-masthead'
import { AnimatedContent } from '@/components/ui/animated-content'

export const metadata: Metadata = {
  title: '文章',
  description: `所有文章列表 - ${SITE.title}`,
  openGraph: {
    title: `文章 | ${SITE.title}`,
    description: `浏览 ${SITE.title} 上的所有文章`,
  },
}

export default function PostsPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const tags = getAllTags()

  return (
    <div>
      <PageMasthead
        eyebrow="文章 — Writing"
        title="全部文章"
        lead="这里是一站式的全部清单，按发布时间倒序排列。"
        counter={`${posts.length} 篇 · 最近 ${posts[0]?.date.slice(0, 10) ?? '—'}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-12 lg:gap-14 items-start">
        <AnimatedContent direction="up" className="min-w-0">
          <PostList posts={posts} emptyHref={`${SITE.repo}/new/main/content/posts/`} />
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.08}>
          <aside className="lg:sticky lg:top-28">
            {categories.length > 0 && (
              <div className="pb-7 mb-7" style={{ borderBottom: '1px solid var(--line)' }}>
                <div className="eyebrow mb-3">分类</div>
                <div className="flex flex-col">
                  {categories.map(({ category, count }) => (
                    <Link
                      key={category}
                      href={`/categories/${category}`}
                      className="group flex items-baseline gap-3 py-1.5 text-sm transition-colors"
                      style={{ color: 'var(--body)' }}
                    >
                      <span className="truncate transition-colors group-hover:text-[var(--accent-text)]">{category}</span>
                      <span className="meta ml-auto">{count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <div className="eyebrow mb-3">标签</div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(({ tag, count }) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="chip px-2.5 py-1 text-xs transition-colors hover:border-[var(--accent-line)]"
                      style={{ color: 'var(--body)' }}
                    >
                      {tag}
                      <span className="meta">{count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </AnimatedContent>
      </div>
    </div>
  )
}
