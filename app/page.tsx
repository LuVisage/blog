import { SITE, SOCIAL_LINKS } from '@/lib/constants'
import { getRecentPosts, getAllPosts, getAllTags, getAllCategories } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { AIHotNews } from '@/components/ai-hot-news'
import { AvatarImage } from '@/components/avatar-image'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { BlurText } from '@/components/ui/blur-text'
import { Typewriter } from '@/components/ui/typewriter'
import { Sparkles } from '@/components/ui/sparkles'
import { FloatingBadge } from '@/components/ui/floating-badge'
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid'
import { AnimatedContent } from '@/components/ui/animated-content'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import { Hyperspeed } from '@/components/ui/hyperspeed'
import { AnimatedGradientText } from '@/components/ui/shiny-text'
import Link from 'next/link'

const MARQUEE_TECH = [
  'AI Agent 开发', 'Next.js', 'React 19', 'Tailwind CSS', 'Framer Motion',
  'TypeScript', 'RAG 架构', 'LLM 应用', '向量数据库', 'LangChain',
  'Agent 框架', 'Prompt 工程', 'Serverless', 'Vercel', '开源项目',
]

export default function HomePage() {
  const posts = getRecentPosts(SITE.postsPerPage)
  const allPosts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()

  return (
    <div>
      {/* ======== Hero — Aurora + Hyperspeed + Background Beams ======== */}
      <section className="mb-12 lg:mb-16">
        <AuroraBackground className="rounded-3xl relative overflow-hidden" opacity={0.7} speed={1.5}>
          {/* Hyperspeed star-field warp */}
          <Hyperspeed
            className="z-[2]"
            starCount={180}
            speed={0.9}
            colors={[
              'rgba(210,210,240,0.8)',
              'rgba(180,180,210,0.6)',
              'rgba(240,240,255,0.7)',
              'rgba(255,255,255,0.9)',
            ]}
          />
          {/* Background Beams overlay */}
          <BackgroundBeams
            beamCount={7}
            colors={[
              'rgba(200,200,220,0.12)',
              'rgba(180,180,200,0.08)',
              'rgba(220,220,240,0.06)',
            ]}
          />

          <div className="relative z-10 p-6 sm:p-10 lg:p-16">
            {/* Main hero */}
            <div className="text-center mb-12">
              {/* Avatar with enhanced glow */}
              <Sparkles count={14} color="#d0d0e0" sizeRange={[8, 22]}>
                <div className="inline-block mb-8">
                  <div className="relative">
                    {/* Outer glow ring */}
                    <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 opacity-20 blur-xl animate-pulse-glow" />
                    <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 p-[3px] animate-border-glow relative">
                      <div className="w-full h-full rounded-full bg-white dark:bg-black/50 flex items-center justify-center overflow-hidden ring-4 ring-white/30 dark:ring-white/10">
                        <AvatarImage src={SITE.avatar} alt={SITE.author.name} />
                      </div>
                    </div>
                  </div>
                </div>
              </Sparkles>

              {/* Title — animated flowing gradient */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight">
                <BlurText
                  text={SITE.title}
                  duration={0.02}
                  delay={0.1}
                  as="span"
                  className="gradient-text animate-gradient-flow"
                  animateOnScroll={false}
                />
              </h1>
              {/* Subtitle glow line */}
              <div className="w-32 h-0.5 mx-auto mb-4 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-400 to-transparent rounded-full animate-pulse" />

              {/* Description — wider max-width */}
              <p className="text-base sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                <Typewriter
                  texts={[
                    SITE.description,
                    '分享 AI Agent 开发实战经验 🤖',
                    '记录技术探索与思考 💡',
                    '写作是最好的思考方式 ✨',
                  ]}
                  typeSpeed={50}
                  deleteSpeed={25}
                  pauseDuration={3000}
                  as="span"
                />
              </p>

              {/* CTA Buttons — larger, more dramatic */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
                <Link
                  href="/posts"
                  className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-900 text-base font-semibold shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  阅读文章
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                {SOCIAL_LINKS.github && (
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white/60 dark:bg-white/10 border-2 border-white/30 dark:border-white/10 text-base font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-white/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                )}
                <a
                  href="https://github.com/LuVisage/blog/new/main/content/posts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-200 dark:border-amber-500/20 text-base font-medium text-amber-700 dark:text-amber-400 hover:border-amber-400 dark:hover:border-amber-500/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  发布文章
                </a>
              </div>

              {/* Stats Bento Grid — 4 columns with staggered effect */}
              <BentoGrid cols={4} className="max-w-3xl mx-auto">
                <BentoCard index={1} className="text-center py-4">
                  <FloatingBadge amplitude={5} delay={0.5}>
                    <div className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">{allPosts.length}</div>
                  </FloatingBadge>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">篇文章</div>
                </BentoCard>
                <BentoCard index={2} className="text-center py-4">
                  <FloatingBadge amplitude={5} delay={0.7}>
                    <div className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">{categories.length}</div>
                  </FloatingBadge>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">个分类</div>
                </BentoCard>
                <BentoCard index={3} className="text-center py-4">
                  <FloatingBadge amplitude={5} delay={0.9}>
                    <div className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">{tags.length}</div>
                  </FloatingBadge>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">个标签</div>
                </BentoCard>
                <BentoCard index={4} className="text-center py-4">
                  <FloatingBadge amplitude={5} delay={1.1}>
                    <div className="text-4xl font-extrabold gradient-text">∞</div>
                  </FloatingBadge>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">无限探索</div>
                </BentoCard>
              </BentoGrid>
            </div>

            {/* Tech Marquee — scrolling at bottom of hero */}
            <div className="mt-4">
              <Marquee speed={30} pauseOnHover>
                {MARQUEE_TECH.map((tech) => (
                  <MarqueeItem key={tech}>{tech}</MarqueeItem>
                ))}
              </Marquee>
            </div>
          </div>
        </AuroraBackground>
      </section>

      {/* ======== AI Hot News ======== */}
      <AnimatedContent direction="up" delay={0.15}>
        <section className="mb-16">
          <AIHotNews />
        </section>
      </AnimatedContent>

      {/* ======== Recent Posts ======== */}
      <AnimatedContent direction="up" delay={0.2}>
        <section>
          <div className="flex items-center justify-between mb-8 lg:mb-10">
            <h2 className="section-title text-xl lg:text-2xl">
              <AnimatedGradientText speed={6}>最新文章</AnimatedGradientText>
            </h2>
            {posts.length > 0 && (
              <Link
                href="/posts"
                className="group text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1.5"
              >
                查看全部
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
          <PostList posts={posts} />
        </section>
      </AnimatedContent>
    </div>
  )
}
