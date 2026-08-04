import { SITE, SOCIAL_LINKS, ABOUT } from '@/lib/constants'
import { getRecentPosts, getAllPosts, getAllTags, getAllCategories, getPopularPosts } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { AIHotNews } from '@/components/ai-hot-news'
import { AvatarImage } from '@/components/avatar-image'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { AnimatedContent } from '@/components/ui/animated-content'
import { TerminalGreeting } from '@/components/ui/terminal-greeting'
import { StatsTile, StatsTileRow } from '@/components/ui/stats-tile'
import { CurrentYear } from '@/components/ui/current-year'
import {
  IconBook, IconBrandGithub, IconSparkles,
  IconArticle, IconFolderFilled, IconTag, IconRss,
  IconMail, IconArrowRight, IconFlame, IconChevronDown,
  IconExternalLink,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function HomePage() {
  const posts = getRecentPosts(SITE.postsPerPage)
  const allPosts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()

  const popularPosts = getPopularPosts(6)
  const popularSlugs = new Set(popularPosts.map(p => p.slug))
  // 去重：先过滤掉热门文章，如果去重后为空（文章太少），则回退到全部最新文章
  const deduped = posts.filter(p => !popularSlugs.has(p.slug)).slice(0, 4)
  const recentOthers = deduped.length > 0 ? deduped : posts.slice(0, 4)

  return (
    <div>
      {/* ======== Hero Section ======== */}
      <section className="mb-12 sm:mb-16">
        <AuroraBackground className="rounded-2xl sm:rounded-3xl relative overflow-hidden" opacity={0.5} speed={1.0}>
          <div className="relative z-10 p-5 sm:p-8 lg:p-14">
            <div className="text-center max-w-2xl mx-auto">
              {/* Avatar with glow */}
              <AnimatedContent direction="up" distance={12} duration={0.5}>
                <div className="inline-block mb-5 sm:mb-6">
                  <div
                    className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-2xl p-[3px] animate-glow-pulse"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), #a78bfa, var(--color-primary))' }}
                  >
                    <div className="w-full h-full rounded-2xl bg-white dark:bg-black/50 flex items-center justify-center overflow-hidden">
                      <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
                    </div>
                  </div>
                </div>
              </AnimatedContent>

              {/* Title */}
              <AnimatedContent direction="up" distance={16} duration={0.5} delay={0.05}>
                <h1 className="heading-1 mb-2 sm:mb-3" style={{ fontSize: 'clamp(30px, 8vw, 60px)' }}>
                  <span className="gradient-text-accent">{SITE.title}</span>
                </h1>
              </AnimatedContent>

              {/* Terminal greeting */}
              <AnimatedContent direction="up" distance={16} duration={0.5} delay={0.1}>
                <div className="mb-4 sm:mb-5">
                  <TerminalGreeting />
                </div>
              </AnimatedContent>

              {/* Description */}
              <AnimatedContent direction="up" distance={16} duration={0.5} delay={0.15}>
                <p className="text-sm sm:text-lg max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed font-medium" style={{ color: 'var(--color-ink)' }}>
                  {SITE.description}
                </p>
              </AnimatedContent>

              {/* CTA Buttons */}
              <AnimatedContent direction="up" distance={16} duration={0.5} delay={0.2}>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/posts" className="btn-primary">
                    <IconBook size={18} strokeWidth={1.5} />
                    阅读文章
                  </Link>
                  {SOCIAL_LINKS.github && (
                    <a
                      href={SOCIAL_LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card rounded-xl inline-flex items-center gap-2 h-11 px-5 text-base font-medium no-underline hover-lift"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      <IconBrandGithub size={18} strokeWidth={1.5} />
                      GitHub
                      <IconExternalLink size={12} strokeWidth={1.5} style={{ color: 'var(--color-muted)' }} />
                    </a>
                  )}
                  <Link href="/rss.xml" className="btn-secondary text-sm h-9 px-4">
                    <IconRss size={14} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
                    RSS
                  </Link>
                </div>
              </AnimatedContent>

              {/* Stats Row */}
              <AnimatedContent direction="up" distance={16} duration={0.5} delay={0.25}>
                <div className="mt-10">
                  <StatsTileRow>
                    <StatsTile
                      value={allPosts.length}
                      label="文章"
                      icon={<IconArticle size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />}
                    />
                    <StatsTile
                      value={categories.length}
                      label="分类"
                      icon={<IconFolderFilled size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />}
                    />
                    <StatsTile
                      value={tags.length}
                      label="标签"
                      icon={<IconTag size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />}
                    />
                    <StatsTile
                      value={<CurrentYear />}
                      label="至今"
                      icon={<IconSparkles size={18} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />}
                    />
                  </StatsTileRow>
                </div>
              </AnimatedContent>

              {/* Scroll-down indicator */}
              <div className="flex justify-center mt-8">
                <span className="animate-bounce inline-flex items-center justify-center w-9 h-9 rounded-full glass cursor-default opacity-60" aria-hidden="true">
                  <IconChevronDown size={16} strokeWidth={2} style={{ color: 'var(--color-muted)' }} />
                </span>
              </div>
            </div>
          </div>
        </AuroraBackground>
      </section>

      {/* ======== Bento Grid: Popular + AI Hot News ======== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mb-16">

        {/* Popular Posts — spans 2 cols */}
        <AnimatedContent direction="up" delay={0.05} className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-5 sm:p-8 flex flex-col h-full" style={{ cursor: 'default' }}>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <IconFlame size={22} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />
              <h2 className="heading-2">热门文章</h2>
              {popularPosts.length > 0 && (
                <span className="text-xs ml-auto px-2 py-0.5 rounded-full glass" style={{ color: 'var(--color-muted)' }}>
                  Top {popularPosts.length}
                </span>
              )}
            </div>

            {popularPosts.length > 0 ? (
              <div className="flex flex-col flex-1">
                {popularPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group flex items-start gap-4 py-3.5 first:pt-0 last:pb-0 rounded-lg -mx-2 px-2 transition-colors hover:bg-[var(--color-primary-soft)]"
                    style={{ borderBottom: index < popularPosts.length - 1 ? '1px solid var(--color-hairline)' : 'none' }}
                  >
                    {/* Rank Number */}
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={
                        index === 0
                          ? { background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)', color: '#fff', boxShadow: '0 2px 8px rgba(124,92,231,0.3)' }
                          : index === 1
                            ? { background: 'rgba(124,92,231,0.18)', color: 'var(--color-primary)' }
                            : index === 2
                              ? { background: 'rgba(124,92,231,0.10)', color: 'var(--color-primary)' }
                              : { background: 'var(--color-hairline-soft)', color: 'var(--color-muted)' }
                      }
                    >
                      {index + 1}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-1" style={{ color: 'var(--color-ink)' }}>
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                          {post.description}
                        </p>
                      )}
                      {post.category && (
                        <span className="inline-block text-[10px] font-medium mt-1.5 px-2 py-0.5 rounded-full glass" style={{ color: 'var(--color-primary)' }}>
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <span className="flex-shrink-0 text-xs mt-0.5 font-mono" style={{ color: 'var(--color-muted)' }}>
                      {post.readingTime} min
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8" style={{ color: 'var(--color-muted)' }}>
                <IconArticle size={40} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
                <p className="text-sm">还没有文章，开始写作吧</p>
              </div>
            )}
          </div>
        </AnimatedContent>

        {/* AI Hot News — sidebar col */}
        <AnimatedContent direction="up" delay={0.1}>
          <AIHotNews />
        </AnimatedContent>
      </div>

      {/* ======== Quick Links Grid ======== */}
      <AnimatedContent direction="up" delay={0.15}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-16">
          {/* About Card */}
          <Link href="/about" className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center gap-2 sm:gap-3 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center gradient-border"
              style={{ background: 'var(--color-primary-soft)' }}>
              <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
            </div>
            <h3 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--color-ink)' }}>{ABOUT.greeting.replace(' 👋', '')}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{ABOUT.title}</p>
            <span className="text-xs mt-auto flex items-center gap-1 group-hover:text-[var(--color-primary)] transition-colors"
              style={{ color: 'var(--color-muted)' }}>
              了解更多 <IconArrowRight size={12} strokeWidth={1.5} />
            </span>
          </Link>

          {/* GitHub Card */}
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
            className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center gap-2 sm:gap-3 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center gradient-border"
              style={{ background: 'var(--color-primary-soft)' }}>
              <IconBrandGithub size={28} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
            </div>
            <h3 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--color-ink)' }}>GitHub</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>开源项目与代码</p>
            <span className="text-xs mt-auto flex items-center gap-1"
              style={{ color: 'var(--color-muted)' }}>
              访问主页 <IconArrowRight size={12} strokeWidth={1.5} />
            </span>
          </a>

          {/* Categories Card */}
          <Link href="/categories" className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center gap-2 sm:gap-3 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center gradient-border"
              style={{ background: 'var(--color-primary-soft)' }}>
              <IconFolderFilled size={28} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--color-ink)' }}>分类浏览</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{categories.length} 个分类</p>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-auto">
                {categories.slice(0, 3).map(cat => (
                  <span key={cat.category} className="px-2 py-0.5 rounded-md text-[10px] font-medium glass" style={{ color: 'var(--color-body)' }}>
                    {cat.category}
                  </span>
                ))}
              </div>
            )}
          </Link>

          {/* Tags Card */}
          <Link href="/tags" className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center gap-2 sm:gap-3 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center gradient-border"
              style={{ background: 'var(--color-primary-soft)' }}>
              <IconTag size={28} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--color-ink)' }}>标签云</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{tags.length} 个标签</p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-auto">
                {tags.slice(0, 4).map(tag => (
                  <span key={tag.tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium glass" style={{ color: 'var(--color-body)' }}>
                    #{tag.tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        </div>
      </AnimatedContent>

      {/* ======== Recent Posts ======== */}
      <AnimatedContent direction="up" delay={0.2}>
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">最新文章</h2>
            {posts.length > 0 && (
              <Link href="/posts" className="btn-ghost text-sm">
                查看全部
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {recentOthers.length > 0 ? (
            <PostList posts={recentOthers} />
          ) : (
            <div className="text-center py-12 glass-card rounded-3xl" style={{ cursor: 'default' }}>
              <IconArticle size={40} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--color-muted-soft)' }} />
              <p className="body-sm">发表你的第一篇文章吧</p>
            </div>
          )}
        </section>
      </AnimatedContent>
    </div>
  )
}
