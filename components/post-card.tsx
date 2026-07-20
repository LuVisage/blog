'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { EmptyState } from '@/components/ui/empty-state'
import { useState, useRef } from 'react'

export function PostCard({ post, index = 0 }: { post: PostMeta; index?: number }) {
  const date = parseISO(post.date)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setGlarePos({ x, y })

    // 3D tilt — max ±8°
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 8
    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <article
      className="animate-scale-in h-full"
      style={{
        animationDelay: `${index * 80}ms`,
        perspective: '1200px',
      }}
    >
      <Link
        ref={cardRef}
        href={`/posts/${post.slug}`}
        className="block h-full relative group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card with 3D tilt */}
        <div
          className="relative h-full rounded-2xl glass-card p-5 sm:p-6 flex flex-col overflow-hidden transition-shadow duration-500"
          style={{
            transform: isHovered
              ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
              : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
            boxShadow: isHovered
              ? `0 24px 48px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.1)`
              : '',
          }}
        >
          {/* Glare overlay — follow cursor with radial gradient */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-0"
            style={{
              opacity: isHovered ? 0.7 : 0,
              transition: 'opacity 0.3s ease',
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 65%)`,
            }}
          />

          {/* Gradient border glow on hover */}
          <div
            className="absolute -inset-[1px] rounded-2xl pointer-events-none z-0"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.4s ease',
              background: `linear-gradient(${120 + rotate.y}deg, rgba(180,180,200,0.5), rgba(200,200,220,0.3), rgba(160,160,180,0.2), rgba(200,200,220,0.4), rgba(180,180,200,0.5))`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />

          {/* Shine sweep on hover */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-0 overflow-hidden"
            style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s ease' }}
          >
            <div
              className="absolute -inset-full w-[200%] h-[200%]"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
                animation: 'shimmer 2.5s infinite',
                animationDelay: `${index * 0.3}s`,
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Category + Date row */}
            <div className="flex items-center justify-between mb-3">
              {post.category ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-800/10 dark:bg-white/10 text-gray-600 dark:text-gray-400 border border-gray-300/20 dark:border-white/5 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400" />
                  {post.category}
                </span>
              ) : (
                <span />
              )}
              <time dateTime={post.date} className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                {format(date, 'MM/dd', { locale: zhCN })}
              </time>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mb-2 leading-snug">
              {post.title}
            </h2>

            {/* Description */}
            {post.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">
                {post.description}
              </p>
            )}

            {/* Footer: reading time + tags */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200/30 dark:border-white/5">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {post.readingTime} min
              </span>

              {post.tags.length > 0 && (
                <div className="flex gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-[10px] text-gray-400 self-center">+{post.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) {
    return (
      <EmptyState
        icon="📝"
        title="还没有文章哦~"
        description="写点什么吧，期待你的第一篇博文 ✨"
        action={{
          label: '✏️ 发布文章',
          href: 'https://github.com/LuVisage/blog/new/main/content/posts/',
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} index={i} />
      ))}
    </div>
  )
}
