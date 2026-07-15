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
                ? 'bg-gray-500 text-white shadow-md shadow-black/10 scale-105'
                : 'bg-gradient-to-r from-white/10 to-white/5 dark:from-white/5 dark:to-white/5 text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10 hover:border-white/30 hover:scale-105'
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
                  ? 'bg-gray-500 text-white shadow-md shadow-black/10 scale-105'
                  : 'bg-gradient-to-r from-white/10 to-white/5 dark:from-white/5 dark:to-white/5 text-gray-700 dark:text-gray-300 border border-white/20 dark:border-white/10 hover:border-white/30 hover:scale-105'
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
              筛选：<span className="text-gray-600">#{selectedTag}</span>
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
