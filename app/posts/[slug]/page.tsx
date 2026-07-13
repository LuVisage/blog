import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/constants'
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/posts'
import { MDXContent } from '@/components/mdx-content'
import { TagBadge } from '@/components/tag-badge'
import { WalineComments } from '@/components/waline-comments'
import { WALINE_CONFIG } from '@/lib/constants'
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
    url: `${SITE.url}/posts/${post.slug}`,
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto">
        {/* Header card */}
        <header className="mb-10 p-6 sm:p-8 lg:p-10 rounded-3xl glass">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-5">
            <span className="gradient-text">{post.title}</span>
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm lg:text-base text-gray-400 dark:text-gray-500 mb-4">
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
        <div className="bg-white/60 dark:bg-purple-950/30 backdrop-blur-sm rounded-3xl p-6 sm:p-10 lg:p-12 border border-pink-100/60 dark:border-purple-500/20 shadow-sm prose prose-gray dark:prose-invert max-w-none">
          <MDXContent source={post.content} />
        </div>

        {/* Prev/Next navigation */}
        <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/posts/${prev.slug}`}
              className="group p-5 rounded-2xl glass glass-hover text-left"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                上一篇
              </span>
              <p className="mt-1.5 font-medium text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              href={`/posts/${next.slug}`}
              className="group p-5 rounded-2xl glass glass-hover text-right"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-end gap-1">
                下一篇
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
              <p className="mt-1.5 font-medium text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      </article>

      {/* Comments */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="rounded-3xl glass p-6 sm:p-8 lg:p-10">
          <WalineComments
            serverURL={WALINE_CONFIG.serverURL}
            dark={WALINE_CONFIG.dark}
            lang={WALINE_CONFIG.lang}
          />
        </div>
      </div>
    </>
  )
}
