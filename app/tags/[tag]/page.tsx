import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllTags, getPostsByTag } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { PageMasthead } from '@/components/page-masthead'
import { IconArrowLeft } from '@tabler/icons-react'

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
      <PageMasthead
        eyebrow="标签 — Tag"
        title={`#${tag}`}
        lead={`${SITE.title} 上关于「${tag}」的全部文章。`}
        counter={`${posts.length} 篇`}
      />

      <div className="flex flex-wrap items-center gap-2 mb-12 pb-5" style={{ borderBottom: '1px solid var(--line)' }}>
        <Link href="/tags" className="btn-ghost text-sm h-9">
          <IconArrowLeft size={14} strokeWidth={2} />
          全部标签
        </Link>
        {allTags.length > 1 && (
          <div className="flex flex-wrap gap-1.5 sm:ml-2">
            {allTags.filter((t) => t.tag !== tag).slice(0, 8).map(({ tag: other }) => (
              <Link
                key={other}
                href={`/tags/${other}`}
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
