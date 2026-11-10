import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE, siteUrl } from '@/lib/constants'
import { coverFor } from '@/lib/covers'
import { getAllPosts, getPostBySlug, getAdjacentPosts, getPostsBySeries } from '@/lib/posts'
import { MDXContent } from '@/components/mdx-content'
import { TagBadge } from '@/components/tag-badge'
import { GiscusComments } from '@/components/giscus-comments'
import { TableOfContents } from '@/components/toc'
import { ChapterBar } from '@/components/chapter-bar'
import { SocialShare } from '@/components/social-share'
import { BookmarkButton } from '@/components/bookmark-button'
import { ImageLightbox } from '@/components/image-lightbox'
import { AuthorCard } from '@/components/author-card'
import { AvatarImage } from '@/components/avatar-image'
import { PostLicense, LICENSE_URL } from '@/components/post-license'
import { RelatedPosts } from '@/components/related-posts'
import { FontSizeControl } from '@/components/font-size-control'
import { ReadingProgress } from '@/components/ui/reading-progress'
import { ProseReveal } from '@/components/ui/prose-reveal'
import { BlurReveal } from '@/components/ui/blur-reveal'
import { CodeBlockEnhancer } from '@/components/code-block-enhancer'
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
  // 有自定义封面就让它当分享图；否则用 3D 渲染静物的 JPEG 版（SVG 在多数
  // 社交平台不被抓取，WebP 兼容性也参差，所以单独留一份 JPEG）。
  const ogImage = post.cover
    ? (/^https?:\/\//i.test(post.cover) ? post.cover : siteUrl(post.cover))
    : siteUrl('images/3d/og-3d.jpg')
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
  const seriesIndex = seriesPosts.findIndex((p) => p.slug === slug)
  const seriesPrev = seriesIndex > 0 ? seriesPosts[seriesIndex - 1] : null
  const seriesNext = seriesIndex >= 0 && seriesIndex < seriesPosts.length - 1 ? seriesPosts[seriesIndex + 1] : null
  const date = parseISO(post.date)
  const postUrl = siteUrl(`posts/${post.slug}`)
  const cover = coverFor(post)
  // 字数照中文博客惯例按字符计：去掉代码块/行内代码/图片/链接地址/ markdown 符号与空白
  const wordCount = post.content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_|\-]/g, '')
    .replace(/\s+/g, '').length

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title, description: post.description,
    datePublished: post.date, dateModified: post.updated || post.date,
    author: { '@type': 'Person', name: SITE.author.name }, url: postUrl,
    license: LICENSE_URL,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />
      <ImageLightbox />

      <div className="xl:flex xl:gap-16">
        <article className="flex-1 min-w-0">
          {/* 窄屏常驻阅读定位条（§11.11）：取代滚过即失联的页首折叠目录 */}
          <ChapterBar />

          {/* Top rail — xl 才自带上线，窄屏由 ChapterBar 的下发丝线承担分隔 */}
          <div
            className="flex items-center justify-between gap-4 py-2.5 border-b-[color:var(--line)] xl:border-t-[color:var(--line-strong)]"
          >
            <Link href="/posts" className="eyebrow inline-flex min-h-6 items-center hover:text-[var(--accent-text)] transition-colors">
              ← 文章目录
            </Link>
            <FontSizeControl />
          </div>

          {/* Article header — 元信息行（stagger）→ 标题（Blur 聚焦入场 §11.10）→ 摘要/系列/标签（stagger） */}
          <div className="pt-10 sm:pt-14 pb-8">
            {/* 作者指定的真实封面才有这张大图；卡片上的生成式 SVG 只做列表装饰，不铺进正文 */}
            <div className="mb-10 overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
              <img
                src={cover.url}
                alt={cover.alt}
                loading="eager"
                decoding="async"
                data-zoomable
                className="block w-full"
                style={{ aspectRatio: '2.2 / 1', objectFit: 'cover' }}
              />
            </div>
            <header className="stagger">
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
                <span style={{ color: 'var(--faint)' }}>/</span>
                <span>约 {wordCount} 字</span>
                {post.updated && (
                  <span style={{ color: 'var(--faint)' }}>
                    （更新于 {format(parseISO(post.updated), 'yyyy.MM.dd', { locale: zhCN })}）
                  </span>
                )}
              </div>
            </header>

            <BlurReveal className="display mt-5" style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.3 }}>
              {post.title}
            </BlurReveal>

            {/* byline：博客的署名在标题下就出现，不等读完才见作者卡 */}
            <div className="mt-5 flex items-center gap-2.5">
              <span
                className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: '1px solid var(--line)' }}
              >
                <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
              </span>
              <span className="body-sm" style={{ color: 'var(--ink)' }}>{SITE.author.name}</span>
            </div>

            <header className="stagger mt-0">
              {post.description && (
                <p className="body-md mt-6 max-w-2xl" style={{ color: 'var(--muted)' }}>
                  {post.description}
                </p>
              )}

              {post.series && (
                <Link
                  href={`/series/${post.series}`}
                  className="chip chip-body inline-flex mt-7 px-3 py-1.5 text-xs"
                  style={{ borderRadius: 'var(--radius-pill)' }}
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
                <div className="flex flex-wrap items-center gap-3 ml-auto">
                  <BookmarkButton slug={post.slug} />
                  <SocialShare title={post.title} url={postUrl} />
                </div>
              </div>
            </header>
          </div>

          {/* Article content — no card, text sits on the canvas */}
          {/* 行长由 .prose 的 --measure（38em，对应中文 34-40 全角）决定，这里不再覆盖。
              ProseReveal 让正文按段落随滚动分批渐入（[文档外] 签名动效，见 SPEC_LEDGER §1.8.4）。 */}
          <ProseReveal className="prose mx-0 mb-6">
            <CodeBlockEnhancer><MDXContent source={post.content} /></CodeBlockEnhancer>
          </ProseReveal>

          <PostLicense />

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
                <span className="heading-3 row-title transition-colors group-hover:text-[var(--accent-text)]">
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
              <span className="heading-3 max-w-full row-title transition-colors group-hover:text-[var(--accent-text)]">
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
                          className="body-md row-title no-underline hover:text-[var(--accent-text)] transition-colors"
                        >
                          {sp.title}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ol>
              {(seriesPrev || seriesNext) && (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4"
                  style={{ borderTop: '1px solid var(--line)' }}
                >
                  {seriesPrev ? (
                    <Link href={`/posts/${seriesPrev.slug}`} className="group flex flex-col gap-1">
                      <span className="caption flex items-center gap-1.5">
                        <IconChevronLeft size={13} strokeWidth={2} /> 系列上一篇
                      </span>
                      <span className="body-sm row-title transition-colors group-hover:text-[var(--accent-text)]">
                        {seriesPrev.title}
                      </span>
                    </Link>
                  ) : <div />}
                  {seriesNext ? (
                    <Link href={`/posts/${seriesNext.slug}`} className="group flex flex-col items-end gap-1 text-right">
                      <span className="caption flex items-center gap-1.5">
                        系列下一篇 <IconChevronRight size={13} strokeWidth={2} />
                      </span>
                      <span className="body-sm row-title transition-colors group-hover:text-[var(--accent-text)]">
                        {seriesNext.title}
                      </span>
                    </Link>
                  ) : <div />}
                </div>
              )}
            </section>
          )}

          <RelatedPosts currentSlug={slug} />

          <AuthorCard />

          <section className="mt-10 surface p-5 sm:p-7">
            <GiscusComments />
          </section>
        </article>

        {/* Desktop TOC — sticky rail, no card */}
        <aside className="hidden xl:flex xl:flex-col xl:w-56 xl:flex-shrink-0">
          <div className="sticky top-24 self-start flex flex-col w-full max-h-[calc(100vh-8rem)] py-5">
            <TableOfContents variant="desktop" />
          </div>
        </aside>
      </div>
    </>
  )
}
