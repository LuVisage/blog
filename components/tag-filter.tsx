'use client'

import { useState, useMemo } from 'react'
import type { PostMeta } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { IconTag, IconX, IconSearch } from '@tabler/icons-react'

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

  // Sort tags by count descending
  const sortedTags = useMemo(() => [...tags].sort((a, b) => b.count - a.count), [tags])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">标签</span>
        </h1>
        <p className="body-sm flex items-center gap-1.5">
          <IconTag size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          共 {tags.length} 个标签 · {posts.length} 篇文章
        </p>
      </div>

      {/* Tag cloud */}
      <div className="rounded-3xl glass-liquid p-6 sm:p-8 mb-8" style={{ cursor: 'default' }}>
        <div className="flex flex-wrap gap-2">
          {/* "All" button */}
          <button
            onClick={() => setSelectedTag(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200"
            style={{
              backgroundColor: selectedTag === null ? 'var(--color-ink)' : 'transparent',
              color: selectedTag === null ? '#fff' : 'var(--color-body)',
              border: selectedTag === null ? 'none' : '1px solid var(--color-hairline)',
            }}
          >
            全部
            <span className="text-[10px] opacity-70">({posts.length})</span>
          </button>
          {sortedTags.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: selectedTag === tag ? 'var(--color-ink)' : 'transparent',
                color: selectedTag === tag ? '#fff' : 'var(--color-body)',
                border: selectedTag === tag ? 'none' : '1px solid var(--color-hairline)',
              }}
            >
              <IconTag size={10} strokeWidth={2.5} />
              {tag}
              <span className="text-[10px] opacity-70">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="animate-fade-up" key={selectedTag ?? '__all__'}>
        {selectedTag && (
          <div className="flex items-center gap-3 mb-6">
            <h2 className="heading-2 flex items-center gap-2">
              筛选：<span style={{ color: 'var(--color-primary)' }}>#{selectedTag}</span>
            </h2>
            <button
              onClick={() => setSelectedTag(null)}
              className="btn-ghost text-xs h-8 px-2.5"
            >
              <IconX size={12} strokeWidth={2} />
              清除
            </button>
            <span className="body-sm ml-auto">
              {filteredPosts.length} 篇
            </span>
          </div>
        )}
        {filteredPosts.length > 0 ? (
          <PostList posts={filteredPosts} />
        ) : selectedTag ? (
          <div className="text-center py-16 glass-liquid rounded-3xl" style={{ cursor: 'default' }}>
            <IconSearch size={36} strokeWidth={1} style={{ color: 'var(--color-muted-soft)' }} className="mx-auto mb-3" />
            <p className="body-sm">该标签下暂无文章</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
