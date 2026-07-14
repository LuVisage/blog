'use client'

import { useState, useMemo } from 'react'
import type { PostMeta } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { TagBadge } from '@/components/tag-badge'

interface Props {
  posts: PostMeta[]
  tags: { tag: string; count: number }[]
}

export function TagFilter({ posts, tags }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts
    return posts.filter((p) => p.tags.includes(selectedTag))
  }, [posts, selectedTag])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">标签</span>
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          共 {tags.length} 个标签 · {posts.length} 篇文章
        </p>
      </div>

      {/* Tag cloud */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap gap-2">
          {/* "All" button */}
          <button
            onClick={() => setSelectedTag(null)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              selectedTag === null
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25 scale-105'
                : 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 hover:border-pink-400 hover:scale-105'
            }`}
          >
            <span className="text-[10px]">📋</span>
            全部
            <span className="text-[10px] opacity-70">({posts.length})</span>
          </button>
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedTag === tag
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25 scale-105'
                  : 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 hover:border-pink-400 hover:scale-105'
              }`}
            >
              <span className="text-[10px]">✦</span>
              {tag}
              <span className="text-[10px] opacity-70">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="animate-fade-in-up" key={selectedTag ?? '__all__'}>
        {selectedTag && (
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              筛选：<span className="text-pink-500">#{selectedTag}</span>
            </h2>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {filteredPosts.length} 篇文章
            </span>
          </div>
        )}
        <PostList posts={filteredPosts} />
      </div>
    </div>
  )
}
