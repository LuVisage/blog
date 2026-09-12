'use client'

import { useState, useMemo } from 'react'
import type { PostMeta } from '@/lib/posts'
import { PostList } from '@/components/post-card'
import { PageMasthead } from '@/components/page-masthead'
import { IconX, IconSearch } from '@tabler/icons-react'

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
      <PageMasthead
        eyebrow="标签 — Tags"
        title="标签"
        lead="按主题筛选，看同一类文章被写到了哪里。"
        counter={`${tags.length} 个标签 · ${posts.length} 篇文章`}
      />

      {/* Tag cloud */}
      <section className="mb-12">
        <div className="eyebrow mb-4">全部标签</div>
        <div className="flex flex-wrap gap-2 pb-8" style={{ borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => setSelectedTag(null)}
            className="chip px-3.5 py-1.5 text-xs transition-colors"
            style={
              selectedTag === null
                ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--on-accent)', fontWeight: 600 }
                : { color: 'var(--body)' }
            }
          >
            全部
            <span className="meta" style={{ color: 'inherit', opacity: 0.7 }}>{posts.length}</span>
          </button>
          {sortedTags.map(({ tag, count }) => {
            const active = selectedTag === tag
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(active ? null : tag)}
                className="chip px-3.5 py-1.5 text-xs transition-colors hover:border-[var(--accent-line)]"
                style={
                  active
                    ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--on-accent)', fontWeight: 600 }
                    : { color: 'var(--body)' }
                }
              >
                {tag}
                <span className="meta" style={{ color: 'inherit', opacity: 0.7 }}>{count}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Results */}
      <div key={selectedTag ?? '__all__'}>
        {selectedTag ? (
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="eyebrow mb-2">当前筛选</div>
              <h2 className="section-title">#{selectedTag}</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="meta">{filteredPosts.length} 篇</span>
              <button onClick={() => setSelectedTag(null)} className="btn-ghost text-sm h-9">
                <IconX size={13} strokeWidth={2} />
                清除
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="eyebrow mb-2">目录</div>
              <h2 className="section-title">全部文章</h2>
            </div>
            <span className="meta">{posts.length} 篇</span>
          </div>
        )}

        {filteredPosts.length > 0 ? (
          <div className="animate-fade-up">
            <PostList posts={filteredPosts} />
          </div>
        ) : (
          <div className="text-center py-20 rule">
            <IconSearch size={30} strokeWidth={1.25} className="mx-auto mb-3" style={{ color: 'var(--faint)' }} />
            <p className="body-sm">该标签下暂无文章</p>
          </div>
        )}
      </div>
    </div>
  )
}
