import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE, siteUrl } from '@/lib/constants'
import { getAllPosts, getPostBySlug, getAdjacentPosts, getPostsBySeries } from '@/lib/posts'
import { MDXContent } from '@/components/mdx-content'
import { GiscusComments } from '@/components/giscus-comments'
import { TableOfContents } from '@/components/toc'
import { ChapterBar } from '@/components/chapter-bar'
import { SocialShare } from '@/components/social-share'
import { BookmarkButton } from '@/components/bookmark-button'
import { AvatarImage } from '@/components/avatar-image'
import { PostLicense, LICENSE_URL } from '@/components/post-license'
import { RelatedPosts } from '@/components/related-posts'
import { SubscribeCard } from '@/components/subscribe-card'
import { ReadingProgress } from '@/components/ui/reading-progress'
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
  // 有自定义封面就让它当分享图；否则用刊头排字卡渲染出的 PNG（og-card.mjs
  // 以站点同款字体栈与令牌截图生成，非 AI 素材；SVG 在多数社交平台不被抓取）。
  const ogImage = post.cover
    ? (/^https?:\/\//i.test(post.cover) ? post.cover : siteUrl(post.cover))
    : siteUrl('og-default.png')
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

// 标题里的「…」引语染信号红，是 A 方向巨字标题的签名细节。
function renderTitle(title: string) {
  return title.split(/(「[^」]*」)/g).map((part, i) =>
    part.startsWith('「') && part.endsWith('」')
      ? <span key={i} className="q">{part}</span>
      : <span key={i}>{part}</span>
  )
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
      {/* 窄屏常驻阅读定位条（<xl）：≥xl 由左目录承担定位 */}
      <ChapterBar />

      <article>
        {/* 刊头元信息 → 巨字标题 → 署名 → 标签 / 动作 */}
        <div className="pmeta">
          <p className="pmeta-row">
            {post.category && (
              <Link href={`/categories/${post.category}`} className="cat no-underline">{post.category}</Link>
            )}
            <span>{format(date, 'yyyy.MM.dd', { locale: zhCN })}</span>
            <span>{post.readingTime} 分钟阅读</span>
            <span>约 {wordCount} 字</span>
            {post.series && (
              <Link href={`/series/${post.series}`} className="pser no-underline">
                系列 · {post.series}{post.seriesOrder ? ` · 第 ${post.seriesOrder} 篇` : ''}
              </Link>
            )}
            {post.updated && (
              <span>更新于 {format(parseISO(post.updated), 'yyyy.MM.dd', { locale: zhCN })}</span>
            )}
          </p>

          <h1 className="ptitle">{renderTitle(post.title)}</h1>

          {/* byline：署名在标题下就出现，不等读完才见作者卡（D1 首屏见人） */}
          <div className="mt-5 flex items-center gap-2.5">
            <span
              className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
              style={{ border: '1px solid var(--line)' }}
            >
              <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
            </span>
            <span className="body-sm" style={{ color: 'var(--ink)' }}>{SITE.author.name}</span>
          </div>

          {post.description && (
            <p className="body-md mt-6 max-w-2xl" style={{ color: 'var(--muted)' }}>{post.description}</p>
          )}

          <div className="ptags" aria-label="标签">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`} className="no-underline">{tag}</Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <BookmarkButton slug={post.slug} />
            <SocialShare url={postUrl} />
          </div>

          <div className="phead-rule" aria-hidden="true" />
        </div>

        {/* 左目录（≥xl sticky）+ 正文 */}
        <div className="pwrap">
          <aside className="toc" aria-label="文章目录">
            <TableOfContents variant="desktop" />
          </aside>

          <div className="min-w-0">
            {/* 行长由 .prose 的 --measure 决定；轻版滚动入场只作用于图/代码/引语/表格/章节标题，
                段落文字始终完整可读（Ctrl+F、打印、无 JS 都不受影响）。 */}
            <div className="prose mx-0 mb-6">
              <CodeBlockEnhancer><MDXContent source={post.content} /></CodeBlockEnhancer>
            </div>

            <PostLicense editHref={`${SITE.repo}/edit/main/content/posts/${slug}.mdx`} />

            <div className="pend">
              {/* 系列位置：两格边框导航 */}
              {seriesPosts.length > 1 && (
                <nav className="seriesnav" aria-label="系列位置">
                  <div className="sn-cell">
                    <p className="sn-k">← 系列上一篇 · {post.series}</p>
                    <p className="sn-t">
                      {seriesPrev
                        ? <Link href={`/posts/${seriesPrev.slug}`} className="no-underline">{seriesPrev.title}</Link>
                        : <span className="muted">已是系列第一篇</span>}
                    </p>
                  </div>
                  <div className="sn-cell">
                    <p className="sn-k">系列下一篇 →</p>
                    <p className="sn-t">
                      {seriesNext
                        ? <Link href={`/posts/${seriesNext.slug}`} className="no-underline">{seriesNext.title}</Link>
                        : <span className="muted">已是系列最新一篇（第 {seriesIndex + 1} 篇 / 共 {seriesPosts.length} 篇）</span>}
                    </p>
                  </div>
                </nav>
              )}

              {/* 读完一篇是订阅意愿最高的时刻；移动端侧栏堆到首页四屏下，
                  文尾这条是移动端唯一顺路的订阅入口（ZM D3）。 */}
              <section className="psub" aria-label="订阅更新">
                <p className="psub-h">订阅这份笔记</p>
                <p className="psub-p">{SITE.description}</p>
                <SubscribeCard bare />
              </section>
            </div>
          </div>
        </div>

        {/* 全站上一篇 / 下一篇 —— 账本行，不是卡片 */}
        <nav className="post-nav grid grid-cols-1 sm:grid-cols-2 mb-12" style={{ marginTop: 'var(--space-64)' }}>
          {prev ? (
            <Link
              href={`/posts/${prev.slug}`}
              className="post-nav__item group flex flex-col gap-2 py-5 sm:pr-8 sm:border-r border-t-[color:var(--line-strong)] border-b-[color:var(--line)] sm:border-r-[color:var(--line)]"
            >
              <span className="caption flex items-center gap-1.5">
                <IconChevronLeft size={13} strokeWidth={2} /> 上一篇
              </span>
              <span className="heading-3 row-title transition-colors group-hover:text-[var(--accent-text)]">{prev.title}</span>
              <span className="post-nav__date">{format(parseISO(prev.date), 'yyyy.MM.dd', { locale: zhCN })}</span>
            </Link>
          ) : (
            <div />
          )}
          <Link
            href={next ? `/posts/${next.slug}` : '/posts'}
            className="post-nav__item group flex flex-col items-end gap-2 py-5 text-right sm:pl-8 border-t-[color:var(--line-strong)] border-b-[color:var(--line)]"
          >
            <span className="caption flex items-center gap-1.5">
              {next ? '下一篇' : '返回列表'} <IconChevronRight size={13} strokeWidth={2} />
            </span>
            <span className="heading-3 max-w-full row-title transition-colors group-hover:text-[var(--accent-text)]">
              {next ? next.title : '查看更多文章'}
            </span>
            {next && <span className="post-nav__date">{format(parseISO(next.date), 'yyyy.MM.dd', { locale: zhCN })}</span>}
          </Link>
        </nav>

        <RelatedPosts currentSlug={slug} />

        <section className="mt-10 surface p-5 sm:p-7">
          <GiscusComments />
        </section>
      </article>
    </>
  )
}
