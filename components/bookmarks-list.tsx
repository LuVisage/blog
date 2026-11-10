'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { IconArrowRight, IconBookmark, IconX } from '@tabler/icons-react'
import { EmptyState } from '@/components/ui/empty-state'
import { readBookmarks, removeBookmark, subscribeBookmarks } from '@/lib/bookmarks'
import type { PostMeta } from '@/lib/posts'

type Status = 'loading' | 'ready'

export function BookmarksList({ posts }: { posts: PostMeta[] }) {
  const [status, setStatus] = useState<Status>('loading')
  const [items, setItems] = useState<PostMeta[]>([])
  const listRef = useRef<HTMLUListElement>(null)
  const emptyRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<string | 'empty' | null>(null)

  useEffect(() => {
    const sync = () => {
      const bySlug = new Map(posts.map((post) => [post.slug, post]))
      setItems(
        readBookmarks()
          .map((slug) => bySlug.get(slug))
          .filter((post): post is PostMeta => Boolean(post))
      )
      setStatus('ready')
    }
    sync()
    return subscribeBookmarks(sync)
  }, [posts])

  useEffect(() => {
    if (!pendingFocus.current) return
    const target = pendingFocus.current
    pendingFocus.current = null

    // 目标必须等 React 提交完新列表后才会存在，所以放到 effect 里而不是事件里。
    // 移走最后一条时列表会整体换成空状态，就把焦点交给「去读文章」。
    const next =
      target === 'empty'
        ? emptyRef.current?.querySelector<HTMLElement>('a, button')
        : listRef.current?.querySelector<HTMLAnchorElement>(`[data-bookmark-link="${target}"]`)
    next?.focus()
  }, [items])

  const handleRemove = (slug: string) => {
    const index = items.findIndex((post) => post.slug === slug)
    const nextSlug = items[index + 1]?.slug ?? items[index - 1]?.slug
    // 被移除的按钮会随行一起卸载；先记下焦点该去哪儿，等列表重渲染后再还回去，
    // 否则键盘用户按完删除键，焦点会掉回 BODY 从头开始 Tab。
    pendingFocus.current = nextSlug ?? 'empty'
    removeBookmark(slug)
  }

  if (status === 'loading') {
    return (
      <p className="body-sm" style={{ color: 'var(--muted)' }}>
        收藏夹保存在当前浏览器里，读取它需要启用 JavaScript；这份清单不会上传到任何服务器。
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <div ref={emptyRef}>
        <EmptyState
          icon={<IconBookmark size={36} strokeWidth={1.5} style={{ color: 'var(--accent-text)' }} />}
          title="收藏夹还是空的"
          description="文章页的「收藏」按钮会把文章存进当前浏览器，不需要账号，也不会上传任何数据。"
          action={{ label: '去读文章', href: '/posts', icon: <IconArrowRight size={15} strokeWidth={1.75} /> }}
        />
      </div>
    )
  }

  return (
    <section aria-labelledby="bookmarks-list-title">
      <div className="bookmarks-toolbar">
        <h2 id="bookmarks-list-title" className="eyebrow">
          已收藏 · {items.length} 篇
        </h2>
        <span className="caption" style={{ color: 'var(--muted)' }}>
          仅保存在此浏览器
        </span>
      </div>

      <ul ref={listRef} className="bookmarks-list" tabIndex={-1} aria-label="收藏的文章">
        {items.map((post) => (
          <li key={post.slug} className="bookmarks-row">
            <div className="bookmarks-row__main">
              <div className="bookmarks-row__meta">
                {post.category && <span className="eyebrow eyebrow-accent">{post.category}</span>}
                <span className="meta">{format(parseISO(post.date), 'yyyy.MM.dd', { locale: zhCN })}</span>
                <span className="meta">{post.readingTime} 分钟</span>
              </div>
              <Link
                href={`/posts/${post.slug}`}
                data-bookmark-link={post.slug}
                className="bookmarks-row__title"
              >
                {post.title}
              </Link>
              {post.description && <p className="bookmarks-row__desc">{post.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => handleRemove(post.slug)}
              className="bookmarks-row__remove pressable"
              aria-label={`从收藏夹移除《${post.title}》`}
              title="移出收藏"
            >
              <IconX size={15} strokeWidth={1.75} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
