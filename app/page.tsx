import { SITE, ABOUT, SOCIAL_LINKS } from '@/lib/constants'
import { getAllPosts, getAllTags, getAllCategories } from '@/lib/posts'
import { PostList, FeatureCard } from '@/components/post-card'
import { AIHotNews } from '@/components/ai-hot-news'
import { AvatarImage } from '@/components/avatar-image'
import { AnimatedContent } from '@/components/ui/animated-content'
import { StatsTile, StatsTileRow } from '@/components/ui/stats-tile'
import { TerminalGreeting } from '@/components/ui/terminal-greeting'
import {
  IconBook, IconBrandGithub, IconRss, IconArrowRight, IconExternalLink,
} from '@tabler/icons-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function HomePage() {
  const allPosts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()
  const latest = allPosts[0]
  const lead = latest

  return (
    <div>
      {/* ════════════ Masthead ════════════ */}
      <section className="mb-16 sm:mb-20">
        <div
          className="flex items-center justify-between gap-4 py-2.5"
          style={{ borderTop: '1px solid var(--line-strong)', borderBottom: '1px solid var(--line)' }}
        >
          <span className="eyebrow">{SITE.author.name} — 个人志</span>
          <span className="eyebrow eyebrow-accent">AI / Agent / LLM</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-10 lg:gap-14 pt-10 sm:pt-12 items-start">
          <AnimatedContent direction="up" distance={14} duration={0.55}>
            <div>
              <h1 className="display">{SITE.title}</h1>

              <div className="mt-5">
                <TerminalGreeting />
              </div>

              <p className="body-lg mt-6 max-w-xl" style={{ color: 'var(--body)' }}>
                {SITE.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-9">
                <Link href="/posts" className="btn-primary">
                  <IconBook size={17} strokeWidth={1.75} />
                  阅读文章
                </Link>
                {SOCIAL_LINKS.github && (
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <IconBrandGithub size={17} strokeWidth={1.75} />
                    GitHub
                    <IconExternalLink size={12} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
                  </a>
                )}
                <Link href="/rss.xml" className="btn-ghost">
                  <IconRss size={15} strokeWidth={1.75} />
                  RSS
                </Link>
              </div>
            </div>
          </AnimatedContent>

          {/* Author card */}
          <AnimatedContent direction="up" distance={14} duration={0.55} delay={0.12}>
            <div className="flex lg:flex-col items-center lg:items-start gap-5 lg:gap-0">
              <div
                className="w-20 h-20 lg:w-32 lg:h-32 flex-shrink-0 overflow-hidden"
                style={{ border: '1px solid var(--line-strong)', borderRadius: 4 }}
              >
                <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
              </div>
              <div className="lg:mt-5">
                <div
                  className="font-serif font-bold lg:text-base"
                  style={{ fontSize: 'clamp(15px, 4vw, 17px)', color: 'var(--ink)' }}
                >
                  {SITE.author.name}
                </div>
                <div className="eyebrow mt-1.5">{ABOUT.title}</div>
              </div>
            </div>
          </AnimatedContent>
        </div>

        {/* Ledger strip */}
        <AnimatedContent direction="up" distance={10} duration={0.5} delay={0.18}>
          <div
            className="mt-12 sm:mt-14 py-7"
            style={{ borderTop: '1px solid var(--line-strong)', borderBottom: '1px solid var(--line)' }}
          >
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
              <StatsTileRow>
                <StatsTile value={allPosts.length} label="文章" />
                <StatsTile value={categories.length} label="分类" />
                <StatsTile value={tags.length} label="标签" />
              </StatsTileRow>
              <span className="eyebrow">
                最近更新{' '}
                {latest ? format(parseISO(latest.date), 'yyyy.MM.dd', { locale: zhCN }) : '—'}
              </span>
            </div>
          </div>
        </AnimatedContent>
      </section>

      {/* ════════════ Lead story ════════════ */}
      {lead && (
        <AnimatedContent direction="up">
          <section className="mb-16 sm:mb-20">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <div className="eyebrow mb-2">头条</div>
                <h2 className="section-title">最新一篇</h2>
              </div>
              <Link href="/posts" className="btn-ghost text-sm">
                全部文章
                <IconArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
            <FeatureCard post={lead} />
          </section>
        </AnimatedContent>
      )}

      {/* ════════════ Index + trending ════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-14 mb-16 sm:mb-20">
        <AnimatedContent direction="up" delay={0.05}>
          <section>
            <div className="eyebrow mb-2">目录</div>
            <h2 className="section-title mb-4">文章索引</h2>
            {allPosts.length > 0 ? (
              <PostList posts={allPosts} layout="index" emptyHref={`${SITE.repo}/new/main/content/posts/`} />
            ) : (
              <p className="body-sm py-10 text-center rule">
                还没有文章，<Link href="/posts" className="underline underline-offset-2" style={{ color: 'var(--accent-text)' }}>去文章列表看看</Link>
              </p>
            )}

            {tags.length > 0 && (
              <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
                <div className="eyebrow mb-4">主题</div>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map(({ tag, count }) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="chip px-3 py-1.5 text-xs hover:text-[var(--accent-text)] transition-colors"
                      style={{ color: 'var(--body)', borderRadius: 999 }}
                    >
                      {tag}
                      <span className="meta">{count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.1}>
          <aside>
            <div className="eyebrow mb-2">外部</div>
            <AIHotNews />
          </aside>
        </AnimatedContent>
      </div>

      {/* ════════════ Sections ledger ════════════ */}
      <AnimatedContent direction="up" delay={0.15}>
        <nav
          aria-label="站点栏目"
          className="grid grid-cols-2 sm:grid-cols-4 py-8"
          style={{ borderTop: '1px solid var(--line-strong)' }}
        >
          {[
            { href: '/categories', label: '分类', count: categories.length },
            { href: '/tags', label: '标签', count: tags.length },
            { href: '/archive', label: '归档', count: allPosts.length },
            { href: '/about', label: '关于', count: null },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="group px-6 sm:px-8 first:pl-0 block"
              style={i > 0 ? { borderLeft: '1px solid var(--line)' } : undefined}
            >
              <span
                className="font-serif font-bold text-lg block transition-colors group-hover:text-[var(--accent-text)]"
                style={{ color: 'var(--ink)' }}
              >
                {item.label}
              </span>
              <span className="eyebrow mt-1.5 block">
                {item.count !== null ? `${item.count} 项` : '了解作者'}
              </span>
            </Link>
          ))}
        </nav>
      </AnimatedContent>
    </div>
  )
}
