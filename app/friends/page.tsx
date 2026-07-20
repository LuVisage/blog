import type { Metadata } from 'next'
import { SITE, FRIENDS } from '@/lib/constants'
import { AnimatedContent } from '@/components/ui/animated-content'
import { WobbleCard } from '@/components/ui/wobble-card'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata: Metadata = {
  title: '友链',
  description: `友情链接 - ${SITE.title}`,
}

export default function FriendsPage() {
  return (
    <div>
      <AnimatedContent direction="up">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            <span className="gradient-text">友链</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            同道中人的博客
          </p>
        </div>
      </AnimatedContent>

      {FRIENDS.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FRIENDS.map((friend, i) => (
            <AnimatedContent key={friend.url} direction="up" delay={i * 0.06}>
              <WobbleCard intensity={3} gloss={true}>
              <a
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl glass-card p-5 sm:p-6 flex items-start gap-4 block"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/50 dark:bg-white/10 border border-white/10 dark:border-white/10 flex items-center justify-center overflow-hidden">
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">🔗</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                    {friend.name}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                    {friend.description}
                  </p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 transition-colors mt-1"
                >
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </a>
              </WobbleCard>
            </AnimatedContent>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🤝"
          title="还没有友链~"
          description="在 lib/constants.ts 中配置 FRIENDS"
        />
      )}

      {/* Exchange info */}
      <AnimatedContent direction="up" delay={0.3}>
        <div className="mt-8 rounded-2xl glass-card p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            💌 交换友链
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            如果你也是 AI/技术方向的博客，欢迎交换友链！
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <code className="px-2 py-1 rounded-lg bg-white/50 dark:bg-white/10 text-gray-800 dark:text-gray-300">
              {SITE.title}
            </code>
            <span className="hidden sm:inline">—</span>
            <code className="px-2 py-1 rounded-lg bg-white/50 dark:bg-white/10 text-gray-800 dark:text-gray-300">
              {SITE.url}
            </code>
            <span className="hidden sm:inline">—</span>
            <span>{SITE.description.slice(0, 30)}...</span>
          </div>
        </div>
      </AnimatedContent>
    </div>
  )
}
