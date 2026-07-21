import type { Metadata } from 'next'
import { SITE, FRIENDS } from '@/lib/constants'
import { AnimatedContent } from '@/components/ui/animated-content'
import { WobbleCard } from '@/components/ui/wobble-card'
import { EmptyState } from '@/components/ui/empty-state'
import { IconLink, IconHeart, IconExternalLink } from '@tabler/icons-react'

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
          <p className="body-sm">
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
                <div className="flex-shrink-0 w-12 h-12 rounded-xl glass flex items-center justify-center overflow-hidden">
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                  ) : (
                    <IconLink size={20} strokeWidth={1.5} style={{ color: 'var(--color-muted)' }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="heading-3">{friend.name}</h3>
                  <p className="body-sm mt-1 line-clamp-2">
                    {friend.description}
                  </p>
                </div>

                <IconExternalLink size={16} strokeWidth={1.5} className="flex-shrink-0 mt-1" style={{ color: 'var(--color-muted)' }} />
              </a>
              </WobbleCard>
            </AnimatedContent>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IconLink size={40} strokeWidth={1.5} style={{ color: 'var(--color-muted-soft)' }} />}
          title="还没有友链~"
          description="在 lib/constants.ts 中配置 FRIENDS"
        />
      )}

      {/* Exchange info */}
      <AnimatedContent direction="up" delay={0.3}>
        <div className="mt-8 rounded-2xl glass-card p-6 text-center">
          <h3 className="heading-3 mb-3 flex items-center justify-center gap-2">
            <IconHeart size={18} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
            交换友链
          </h3>
          <p className="body-sm mb-3">
            如果你也是 AI/技术方向的博客，欢迎交换友链！
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 caption">
            <code className="px-2 py-1 rounded-lg glass" style={{ color: 'var(--color-ink)' }}>
              {SITE.title}
            </code>
            <span className="hidden sm:inline" style={{ color: 'var(--color-muted-soft)' }}>—</span>
            <code className="px-2 py-1 rounded-lg glass" style={{ color: 'var(--color-ink)' }}>
              {SITE.url}
            </code>
            <span className="hidden sm:inline" style={{ color: 'var(--color-muted-soft)' }}>—</span>
            <span>{SITE.description.slice(0, 30)}...</span>
          </div>
        </div>
      </AnimatedContent>
    </div>
  )
}
