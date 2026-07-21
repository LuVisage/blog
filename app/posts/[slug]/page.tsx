import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllPosts, getPostBySlug, getAdjacentPosts, getPostsBySeries } from '@/lib/posts'
import { MDXContent } from '@/components/mdx-content'
import { TagBadge } from '@/components/tag-badge'
import { GiscusComments } from '@/components/giscus-comments'
import { TableOfContents } from '@/components/toc'
import { SocialShare } from '@/components/social-share'
import { RelatedPosts } from '@/components/related-posts'
import { FontSizeControl } from '@/components/font-size-control'
import { ReadingProgress } from '@/components/ui/reading-progress'
import { CodeBlockEnhancer } from '@/components/code-block-enhancer'
import { LikeButton } from '@/components/like-button'
import { IconFolderFilled, IconChevronLeft, IconChevronRight, IconCalendar, IconClock } from '@tabler/icons-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type PageParams = Promise<{ slug: string }>

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const url = `${SITE.url}/posts/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title, description: post.description, type: 'article',
      publishedTime: post.date, modifiedTime: post.updated, url, tags: post.tags,
      images: [{ url: `${SITE.url}/og-default.svg`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [`${SITE.url}/og-default.svg`] },
  }
}

export default async function PostPage({ params }: { params: PageParams }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)
  const seriesPosts = post.series ? getPostsBySeries(post.series) : []
  const date = parseISO(post.date)
  const postUrl = `${SITE.url}/posts/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title, description: post.description,
    datePublished: post.date, dateModified: post.updated || post.date,
    author: { '@type': 'Person', name: SITE.author.name }, url: postUrl,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />

      <div className="xl:flex xl:gap-8">
        <article className="flex-1 min-w-0 max-w-3xl relative">
          {/* Desktop TOC — floated alongside article, not a separate column */}
          <aside className="hidden xl:block absolute left-[calc(100%+2rem)] top-0 w-44">
            <div className="sticky top-28"><TableOfContents /></div>
          </aside>

          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
            <Link href="/posts" className="btn-ghost text-sm">
              <IconChevronLeft size={16} strokeWidth={2} /> 文章列表
            </Link>
            <FontSizeControl />
          </div>

          {/* Mobile TOC */}
          <div className="xl:hidden mb-8"><TableOfContents /></div>

          {/* Article header */}
          <header className="mb-10">
            {post.category && (
              <Link
                href={`/categories/${post.category}`}
                className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full text-xs font-medium glass"
              >
                <IconFolderFilled size={12} style={{ color: 'var(--color-primary)' }} />
                {post.category}
              </Link>
            )}
            <h1 className="heading-1 mb-4" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              <span className="gradient-text">{post.title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3 caption mb-4">
              <span className="flex items-center gap-1.5">
                <IconCalendar size={14} strokeWidth={1.5} />
                {format(date, 'yyyy 年 M 月 d 日', { locale: zhCN })}
              </span>
              {post.updated && <span>更新于 {format(parseISO(post.updated), 'yyyy 年 M 月 d 日', { locale: zhCN })}</span>}
              <span>·</span>
              <span className="flex items-center gap-1.5"><IconClock size={14} strokeWidth={1.5} /> {post.readingTime} 分钟阅读</span>
              {post.series && <><span>·</span><Link href={`/series/${post.series}`} style={{ color: 'var(--color-primary)' }}>{post.series}</Link></>}
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">{post.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}</div>
            )}
          </header>

          {/* Article content */}
          <div className="rounded-3xl glass-card p-6 sm:p-10 lg:p-12 prose max-w-none mb-12">
            <CodeBlockEnhancer><MDXContent source={post.content} /></CodeBlockEnhancer>
          </div>

          {/* Share + Like */}
          <div className="mb-12 p-5 rounded-2xl glass-card flex items-center justify-between flex-wrap gap-3">
            <SocialShare title={post.title} url={postUrl} />
            <LikeButton slug={slug} />
          </div>

          {/* Prev/Next */}
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {prev ? (
              <Link href={`/posts/${prev.slug}`} className="glass-card rounded-2xl p-5 text-left">
                <span className="caption flex items-center gap-1 mb-1.5"><IconChevronLeft size={12} strokeWidth={2} /> 上一篇</span>
                <p className="body-sm font-medium line-clamp-1" style={{ color: 'var(--color-ink)' }}>{prev.title}</p>
              </Link>
            ) : <div />}
            {next && (
              <Link href={`/posts/${next.slug}`} className="glass-card rounded-2xl p-5 text-right">
                <span className="caption flex items-center justify-end gap-1 mb-1.5">下一篇 <IconChevronRight size={12} strokeWidth={2} /></span>
                <p className="body-sm font-medium line-clamp-1" style={{ color: 'var(--color-ink)' }}>{next.title}</p>
              </Link>
            )}
          </nav>

          {/* Series Navigation */}
          {seriesPosts.length > 1 && (
            <div className="mb-12 p-5 sm:p-6 rounded-2xl glass-card">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5" style={{ color: 'var(--color-ink)' }}>
                <IconFolderFilled size={14} style={{ color: 'var(--color-primary)' }} />
                系列文章：{post.series}
              </h3>
              <div className="space-y-1">
                {seriesPosts.map((sp, i) => {
                  const isCurrent = sp.slug === slug
                  return (
                    <div
                      key={sp.slug}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isCurrent ? '' : 'hover:bg-[var(--color-primary-soft)]'
                      }`}
                      style={{
                        color: isCurrent ? 'var(--color-primary)' : 'var(--color-body)',
                        fontWeight: isCurrent ? 600 : 400,
                        background: isCurrent ? 'var(--color-primary-soft)' : 'transparent',
                      }}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                        style={{
                          color: isCurrent ? '#fff' : 'var(--color-muted)',
                          background: isCurrent ? 'var(--color-primary)' : 'var(--color-hairline-soft)',
                        }}>
                        {i + 1}
                      </span>
                      {isCurrent ? (
                        <span>{sp.title}</span>
                      ) : (
                        <Link href={`/posts/${sp.slug}`} className="flex-1 no-underline" style={{ color: 'var(--color-body)' }}>
                          {sp.title}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <RelatedPosts currentSlug={slug} />

          <div className="mt-12 p-6 sm:p-8 rounded-3xl glass-card"><GiscusComments /></div>
        </article>
      </div>
    </>
  )
}
