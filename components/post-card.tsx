'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { EmptyState } from '@/components/ui/empty-state'
import { useState } from 'react'

export function PostCard({ post, index = 0 }: { post: PostMeta; index?: number }) {
  const date = parseISO(post.date)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setGlarePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <article
      className="animate-scale-in h-full"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/posts/${post.slug}`}
        className="block h-full relative group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card — Uiverse.io style: clean glass, subtle lift on hover */}
        <div className="relative h-full rounded-2xl glass-card p-5 sm:p-6 flex flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
          {/* Subtle glare — follows cursor, only visible on hover */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.35 : 0,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.25) 0%, transparent 55%)`,
            }}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Category + Date row */}
            <div className="flex items-center justify-between mb-3">
              {post.category ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-800/10 dark:bg-white/10 text-gray-600 dark:text-gray-400 border border-gray-300/20 dark:border-white/5">
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
