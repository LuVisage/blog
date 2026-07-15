import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/posts'
import { MDXContent } from '@/components/mdx-content'
import { TagBadge } from '@/components/tag-badge'
import { GiscusComments } from '@/components/giscus-comments'
import { TableOfContents } from '@/components/toc'
import { SocialShare } from '@/components/social-share'
import { RelatedPosts } from '@/components/related-posts'
import { FontSizeControl } from '@/components/font-size-control'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type PageParams = Promise<{ slug: string }>

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: PageParams
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const url = `${SITE.url}/posts/${post.slug}`

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      url,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function PostPage({ params }: { params: PageParams }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)
  const date = parseISO(post.date)
  const postUrl = `${SITE.url}/posts/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: SITE.author.name,
    },
    url: postUrl,
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="xl:flex xl:gap-12">
        {/* TOC — single instance: mobile toggle (above article), desktop sidebar (right) */}
        <aside className="mb-4 xl:order-last xl:w-56 xl:flex-shrink-0">
          <TableOfContents />
        </aside>

        {/* Main article area */}
        <article className="flex-1 min-w-0 max-w-3xl">
          {/* Toolbar */}
          <div className="flex items-center justify-end flex-wrap gap-3 mb-6">
            <FontSizeControl />
          </div>

          {/* Header card */}
          <header className="mb-8 p-6 sm:p-8 lg:p-10 rounded-3xl glass-card">
            {/* Category */}
            {post.category && (
              <Link
                href={`/categories/${post.category}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/50 dark:bg-white/10 text-gray-800 dark:text-gray-300 text-xs font-medium border border-white/10 dark:border-white/10 hover:border-white/30 dark:hover:border-white/10 transition-all mb-4"
              >
                📂 {post.category}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-5">
              <span className="gradient-text">{post.title}</span>
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-4">
              <time dateTime={post.date} className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {format(date, 'yyyy 年 M 月 d 日', { locale: zhCN })}
              </time>
              {post.updated && (
                <>
                  <span>·</span>
                  <span>
                    更新于{' '}
                    {format(parseISO(post.updated), 'yyyy 年 M 月 d 日', {
                      locale: zhCN,
                    })}
                  </span>
                </>
              )}
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {post.readingTime} 分钟阅读
              </span>
              {post.series && (
                <>
                  <span>·</span>
                  <Link
                    href={`/series/${post.series}`}
                    className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                    {post.series}
                  </Link>
                </>
              )}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 dark:border-white/5 shadow-sm prose prose-gray dark:prose-invert max-w-none">
            <MDXContent source={post.content} />
          </div>

          {/* Share + Tags at bottom */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card">
            <SocialShare title={post.title} url={postUrl} />
          </div>

          {/* Prev/Next navigation */}
          <nav className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/posts/${prev.slug}`}
                className="group p-5 rounded-2xl glass-card text-left hover:scale-[1.01] transition-transform"
              >
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  上一篇
                </span>
                <p className="mt-1.5 font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors line-clamp-1">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/posts/${next.slug}`}
                className="group p-5 rounded-2xl glass-card text-right hover:scale-[1.01] transition-transform"
              >
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-end gap-1">
                  下一篇
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
                <p className="mt-1.5 font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors line-clamp-1">
                  {next.title}
                </p>
              </Link>
            )}
          </nav>

          {/* Related Posts */}
          <RelatedPosts currentSlug={slug} />

          {/* Comments */}
          <div className="mt-12">
            <div className="rounded-3xl glass-card p-6 sm:p-8 lg:p-10">
              <GiscusComments />
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
