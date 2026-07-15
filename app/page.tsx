import { SITE, SOCIAL_LINKS } from '@/lib/constants'
import { getRecentPosts } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { AIHotNews } from '@/components/ai-hot-news'
import { AvatarImage } from '@/components/avatar-image'
import Link from 'next/link'

export default function HomePage() {
  const posts = getRecentPosts(SITE.postsPerPage)

  return (
    <div>
      {/* ======== Hero Section ======== */}
      <section className="mb-16 lg:mb-20">
        <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12 lg:p-16 animate-scale-in">
          {/* Desktop: horizontal layout | Mobile: stacked */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 text-center lg:text-left">
            {/* Avatar */}
            <div className="flex-shrink-0 mx-auto lg:mx-0 mb-6 lg:mb-0">
              <div
                className="relative group w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 p-[3px] animate-border-glow"
                title="💡 替换头像：将你的照片保存为 public/avatar.jpg"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-black/30 flex items-center justify-center overflow-hidden">
                  <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
                </div>
                {/* Hover hint */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-white text-[10px] sm:text-xs px-2 text-center leading-tight">
                    📷 将照片保存为<br /><code className="text-gray-500">public/avatar.jpg</code>
                  </span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 lg:mb-4">
                <span className="gradient-text animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}>{SITE.title}</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-lg lg:max-w-none mx-auto lg:mx-0 mb-6 lg:mb-8 leading-relaxed">
                {SITE.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {SOCIAL_LINKS.github && (
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/10 text-sm text-gray-800 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-white/30 dark:hover:border-white/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                <Link
                  href="/posts"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-medium shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/25 hover:-translate-y-0.5 transition-all animate-pulse-glow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  阅读文章
                </Link>
                {SOCIAL_LINKS.email && (
                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/10 text-sm text-gray-800 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-white/30 dark:hover:border-white/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    联系我
                  </a>
                )}
                <a
                  href="https://github.com/LuVisage/blog/new/main/content/posts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-500/20 text-sm text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:border-amber-400 dark:hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  发布文章
                </a>
              </div>
            </div>
          </div>

          {/* Decorative stars */}
          <div className="absolute top-4 right-4 opacity-20 hidden lg:block">
            <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
              <path d="M20 0l4 8 8 2-6 6 1 9-7-4-7 4 1-9-6-6 8-2z" fill="#999999" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 opacity-20 hidden lg:block">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 0l4 8 8 2-6 6 1 9-7-4-7 4 1-9-6-6 8-2z" fill="#aaaaaa" />
            </svg>
          </div>
        </div>
      </section>

      {/* ======== AI Hot News ======== */}
      <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <AIHotNews />
      </section>

      {/* ======== Recent Posts ======== */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            最新文章
          </h2>
          {posts.length > 0 && (
            <Link
              href="/posts"
              className="text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1 font-medium"
            >
              查看全部
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        <PostList posts={posts} />
      </section>
    </div>
  )
}
