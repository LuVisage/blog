import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'

export function PostCard({ post, index = 0 }: { post: PostMeta; index?: number }) {
  const date = parseISO(post.date)

  return (
    <article
      className="animate-fade-in-up h-full"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/posts/${post.slug}`}
        className="block h-full p-5 sm:p-6 rounded-2xl glass glass-hover group"
      >
        {/* Meta line */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-3">
          <time dateTime={post.date} className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {format(date, 'yyyy 年 M 月 d 日', { locale: zhCN })}
          </time>
          <span className="text-pink-300 dark:text-pink-600">·</span>
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {post.readingTime} 分钟
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors mb-2">
          {post.title}
        </h2>

        {/* Description */}
        {post.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {post.description}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🌸</div>
        <p className="text-gray-400 dark:text-gray-500 text-lg">还没有文章哦~</p>
        <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">写点什么吧 ✨</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} index={i} />
      ))}
    </div>
  )
}
