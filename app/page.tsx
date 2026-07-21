import { SITE, SOCIAL_LINKS, ABOUT } from '@/lib/constants'
import { getRecentPosts, getAllPosts, getAllTags, getAllCategories, getPopularPosts } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { AIHotNews } from '@/components/ai-hot-news'
import { AvatarImage } from '@/components/avatar-image'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { AnimatedContent } from '@/components/ui/animated-content'
import { TerminalGreeting } from '@/components/ui/terminal-greeting'
import { StatsTile, StatsTileRow } from '@/components/ui/stats-tile'
import {
  IconBook, IconBrandGithub, IconSparkles,
  IconArticle, IconFolderFilled, IconTag, IconRss,
  IconMail, IconArrowRight,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function HomePage() {
  const posts = getRecentPosts(SITE.postsPerPage)
  const allPosts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()

  const popularPosts = getPopularPosts(6)
  const recentOthers = posts.slice(0, 4) // max 4 recent posts

  return (
    <div>
      {/* ======== Hero with Aurora ======== */}
      <section className="mb-16">
        <AuroraBackground className="rounded-3xl relative overflow-hidden" opacity={0.45} speed={1.2}>
          <div className="relative z-10 p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-10">
              {/* Avatar */}
              <div className="inline-block mb-6">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl p-[3px]"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)' }}
                >
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-black/50 flex items-center justify-center overflow-hidden">
                    <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="heading-1 mb-3" style={{ fontSize: 'clamp(36px, 6vw, 56px)' }}>
                <span className="gradient-text">{SITE.title}</span>
              </h1>

              {/* Terminal subtitle */}
              <div className="mb-6">
                <TerminalGreeting />
              </div>

              {/* Description */}
              <p className="body-lg max-w-xl mx-auto mb-8">
                {SITE.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/posts" className="btn-primary">
                  <IconBook size={18} strokeWidth={1.5} />
                  阅读文章
                </Link>
                {SOCIAL_LINKS.github && (
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-xl inline-flex items-center gap-2 h-11 px-5 text-base font-medium no-underline"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    <IconBrandGithub size={18} strokeWidth={1.5} />
                    GitHub
                  </a>
                )}
                <Link href="/rss.xml" className="glass rounded-xl inline-flex items-center gap-2 h-11 px-5 text-sm font-medium no-underline"
                  style={{ color: 'var(--color-muted)' }}>
                  <IconRss size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
                  RSS
                </Link>
              </div>
            </div>

            {/* Stats Row */}
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
                value={new Date().getFullYear()}
                label="至今"
                icon={<IconSparkles size={18} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />}
              />
            </StatsTileRow>
          </div>
        </AuroraBackground>
      </section>

      {/* ======== Bento Grid: Main Content ======== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-16">

        {/* Popular Posts Ranking — spans 2 cols */}
        <AnimatedContent direction="up" delay={0.05} className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col h-full">
            {/* Title */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">🔥</span>
              <h2 className="heading-2">热门文章</h2>
            </div>

            {/* Ranking List */}
            {popularPosts.length > 0 ? (
              <div className="flex flex-col flex-1">
                {popularPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group flex items-start gap-4 py-3.5 first:pt-0 last:pb-0"
                    style={{ borderBottom: index < popularPosts.length - 1 ? '1px solid var(--color-hairline)' : 'none' }}
                  >
                    {/* Rank Number */}
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={
                        index === 0
                          ? { background: 'var(--color-primary)', color: '#fff' }
                          : index === 1
                            ? { background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary)' }
                            : index === 2
                              ? { background: 'rgba(99,102,241,0.08)', color: 'var(--color-primary)' }
                              : { background: 'var(--color-hairline)', color: 'var(--color-muted)' }
                      }
                    >
                      {index + 1}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-muted)' }}>
                          {post.description}
                        </p>
                      )}
                    </div>

                    {/* Meta */}
                    <span className="flex-shrink-0 text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                      {post.readingTime} 分钟
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--color-muted)' }}>
                <IconArticle size={40} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
                <p className="text-sm">还没有文章，开始写作吧 ✨</p>
              </div>
            )}
          </div>
        </AnimatedContent>

        {/* AI Hot News — sidebar col */}
        <AnimatedContent direction="up" delay={0.1}>
          <AIHotNews />
        </AnimatedContent>
      </div>

      {/* ======== Bento Row: Quick Links ======== */}
      <AnimatedContent direction="up" delay={0.15}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {/* About Card */}
          <Link href="/about" className="glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-2 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-primary-soft)' }}>
              <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
            </div>
            <h3 className="heading-3">{ABOUT.greeting.replace(' 👋', '')}</h3>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{ABOUT.title}</p>
            <span className="text-xs mt-1 flex items-center gap-1 group-hover:text-[var(--color-primary)] transition-colors"
              style={{ color: 'var(--color-muted)' }}>
              了解更多 <IconArrowRight size={12} strokeWidth={1.5} />
            </span>
          </Link>

          {/* GitHub Card */}
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer"
            className="glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-2 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-primary-soft)' }}>
              <IconBrandGithub size={26} strokeWidth={1.5} style={{ color: 'var(--color-ink)' }} />
            </div>
            <h3 className="heading-3">GitHub</h3>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>开源项目与代码</p>
            <span className="text-xs mt-1 flex items-center gap-1"
              style={{ color: 'var(--color-muted)' }}>
              访问主页 <IconArrowRight size={12} strokeWidth={1.5} />
            </span>
          </a>

          {/* Categories Card */}
          <Link href="/categories" className="glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-2 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-primary-soft)' }}>
              <IconFolderFilled size={26} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="heading-3">分类浏览</h3>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{categories.length} 个分类</p>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {categories.slice(0, 3).map(cat => (
                  <span key={cat.category} className="px-2 py-0.5 rounded-md text-[10px] glass" style={{ color: 'var(--color-body)' }}>
                    {cat.category}
                  </span>
                ))}
              </div>
            )}
          </Link>

          {/* Tags Card */}
          <Link href="/tags" className="glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-2 group">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-primary-soft)' }}>
              <IconTag size={26} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="heading-3">标签云</h3>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{tags.length} 个标签</p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {tags.slice(0, 4).map(tag => (
                  <span key={tag.tag} className="px-2 py-0.5 rounded-md text-[10px] glass" style={{ color: 'var(--color-body)' }}>
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
          <PostList posts={recentOthers} />
        </section>
      </AnimatedContent>
    </div>
  )
}
