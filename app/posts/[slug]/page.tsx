import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE, siteUrl } from '@/lib/constants'
import { getAllPosts, getPostBySlug, getAdjacentPosts, getPostsBySeries } from '@/lib/posts'
import { MDXContent } from '@/components/mdx-content'
import { TagBadge } from '@/components/tag-badge'
import { GiscusComments } from '@/components/giscus-comments'
import { TableOfContents } from '@/components/toc'
import { SocialShare } from '@/components/social-share'
import { RelatedPosts } from '@/components/related-posts'
import { FontSizeControl } from '@/components/font-size-control'
import { ReadingProgress } from '@/components/ui/reading-progress'
import { ReadingAchievements } from '@/components/reading-achievements'
import { CodeBlockEnhancer } from '@/components/code-block-enhancer'
import { LikeButton } from '@/components/like-button'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
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
  const url = siteUrl(`posts/${post.slug}`)
  const ogImage = siteUrl('og-default.svg')
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title, description: post.description, type: 'article',
      publishedTime: post.date, modifiedTime: post.updated, url, tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [ogImage] },
  }
}

export default async function PostPage({ params }: { params: PageParams }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)
  const seriesPosts = post.series ? getPostsBySeries(post.series) : []
  const date = parseISO(post.date)
  const postUrl = siteUrl(`posts/${post.slug}`)

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
      <ReadingAchievements />

      <div className="xl:flex xl:gap-14">
        <article className="flex-1 min-w-0">
          {/* Mobile TOC */}
          <div className="xl:hidden mb-6"><TableOfContents /></div>

          {/* Top rail */}
          <div
            className="flex items-center justify-between gap-4 py-2.5"
            style={{ borderTop: '1px solid var(--line-strong)', borderBottom: '1px solid var(--line)' }}
          >
            <Link href="/posts" className="eyebrow inline-flex min-h-6 items-center hover:text-[var(--accent-text)] transition-colors">
              ← 文章目录
            </Link>
            <FontSizeControl />
          </div>

          {/* Article header */}
          <header className="pt-10 sm:pt-14 pb-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 eyebrow">
              {post.category && (
                <Link
                  href={`/categories/${post.category}`}
                  className="eyebrow eyebrow-accent inline-flex min-h-6 items-center hover:underline underline-offset-4"
                >
                  {post.category}
                </Link>
              )}
              {post.category && <span style={{ color: 'var(--faint)' }}>/</span>}
              <span>{format(date, 'yyyy.MM.dd', { locale: zhCN })}</span>
              <span style={{ color: 'var(--faint)' }}>/</span>
              <span>{post.readingTime} 分钟阅读</span>
              {post.updated && (
                <span style={{ color: 'var(--faint)' }}>
                  （更新于 {format(parseISO(post.updated), 'yyyy.MM.dd', { locale: zhCN })}）
                </span>
              )}
            </div>

            <h1 className="display mt-5" style={{ fontSize: 'clamp(30px, 5.6vw, 54px)', lineHeight: 1.16 }}>
              {post.title}
            </h1>

            {post.description && (
              <p className="body-lg mt-6 max-w-2xl" style={{ color: 'var(--muted)' }}>
                {post.description}
              </p>
            )}

            {post.series && (
              <Link
                href={`/series/${post.series}`}
                className="chip inline-flex mt-7 px-3 py-1.5 text-xs hover:text-[var(--accent-text)] transition-colors"
                style={{ color: 'var(--body)', borderRadius: 999 }}
              >
                <span className="eyebrow">系列</span>
                {post.series}
              </Link>
            )}

            <div
              className="flex flex-wrap items-center gap-2 mt-8 pt-6"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              {post.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
              <div className="flex items-center gap-3 ml-auto">
                <SocialShare title={post.title} url={postUrl} />
                <LikeButton slug={slug} />
              </div>
            </div>
          </header>

          {/* Article content — no card, text sits on the canvas */}
          <div className="prose mx-0 max-w-[68ch] mb-14">
            <CodeBlockEnhancer><MDXContent source={post.content} /></CodeBlockEnhancer>
          </div>

          {/* Prev / next — ledger row, not cards */}
          <nav className="grid grid-cols-1 sm:grid-cols-2 mb-12">
            {prev ? (
              <Link
                href={`/posts/${prev.slug}`}
                data-spotlight="row"
                className="group flex flex-col gap-2 py-5 sm:pr-8 sm:border-r border-t-[color:var(--line-strong)] border-b-[color:var(--line)] sm:border-r-[color:var(--line)]"
              >
                <span className="caption flex items-center gap-1.5">
                  <IconChevronLeft size={13} strokeWidth={2} /> 上一篇
                </span>
                <span className="heading-3 truncate transition-colors group-hover:text-[var(--accent-text)]">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            <Link
              href={next ? `/posts/${next.slug}` : '/posts'}
              data-spotlight="row"
              className="group flex flex-col items-end gap-2 py-5 text-right sm:pl-8 border-t-[color:var(--line-strong)] border-b-[color:var(--line)]"
            >
              <span className="caption flex items-center gap-1.5">
                {next ? '下一篇' : '返回列表'} <IconChevronRight size={13} strokeWidth={2} />
              </span>
              <span className="heading-3 max-w-full truncate transition-colors group-hover:text-[var(--accent-text)]">
                {next ? next.title : '查看更多文章'}
              </span>
            </Link>
          </nav>

          {/* Series */}
          {seriesPosts.length > 1 && (
            <section className="mb-12 surface p-5 sm:p-6">
              <h2 className="eyebrow mb-4">
                系列文章 · {post.series}
              </h2>
              <ol>
                {seriesPosts.map((sp, i) => {
                  const isCurrent = sp.slug === slug
                  return (
                    <li
                      key={sp.slug}
                      className="grid grid-cols-[28px_minmax(0,1fr)] items-baseline gap-3 py-2.5 rule"
                    >
                      <span className="meta tabular-nums" style={{ color: isCurrent ? 'var(--accent-text)' : 'var(--faint)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {isCurrent ? (
                        <span className="body-md" style={{ color: 'var(--ink)' }}>{sp.title}</span>
                      ) : (
                        <Link
                          href={`/posts/${sp.slug}`}
                          className="body-md truncate no-underline hover:text-[var(--accent-text)] transition-colors"
                        >
                          {sp.title}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ol>
            </section>
          )}

          <RelatedPosts currentSlug={slug} />

          <section className="mt-10 surface p-5 sm:p-7">
            <GiscusComments />
          </section>
        </article>

        {/* Desktop TOC — sticky rail, no card */}
        <aside className="hidden xl:flex xl:flex-col xl:w-56 xl:flex-shrink-0">
          <div className="sticky top-24 self-start flex flex-col w-full max-h-[calc(100vh-8rem)] py-5">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </>
  )
}
