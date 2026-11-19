'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  format, subMonths, parseISO, getDay,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Props {
  posts: PostMeta[]
}

const MONTH_COUNT = 6
const EDGE = 12
const GAP = 8

/** 浮层锚点：格子的视口坐标 + 当时的视口高 —— 用 bottom 对齐上沿，省掉一次测高。 */
interface Anchor {
  date: Date
  posts: PostMeta[]
  left: number
  top: number
  bottom: number
  vh: number
}

const LEGEND = [
  { heat: 'var(--heat-0)', label: '未更新' },
  { heat: 'var(--heat-1)', label: '1 篇' },
  { heat: 'var(--heat-2)', label: '多篇' },
]

export function PostsCalendar({ posts }: Props) {
  const [tip, setTip] = useState<Anchor | null>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ x: 0, below: false })

  const datePostsMap = useMemo(() => {
    const map = new Map<string, PostMeta[]>()
    for (const post of posts) {
      const key = format(parseISO(post.date), 'yyyy-MM-dd')
      const bucket = map.get(key)
      if (bucket) bucket.push(post)
      else map.set(key, [post])
    }
    return map
  }, [posts])

  const months = useMemo(() => {
    const today = new Date()
    return Array.from({ length: MONTH_COUNT }, (_, i) => {
      const monthDate = subMonths(today, MONTH_COUNT - 1 - i)
      const start = startOfMonth(monthDate)
      const days = eachDayOfInterval({ start, end: endOfMonth(monthDate) })
      return {
        days: [...Array<null>(getDay(start)).fill(null), ...days] as (Date | null)[],
        label: format(monthDate, 'M月', { locale: zhCN }),
      }
    })
  }, [])

  // 浮层挂到 body：任何祖先的 transform / overflow 都会给 fixed 建立 containing block
  // 或把它裁掉，浮层就会和格子错位；挂 body 一劳永逸。
  useLayoutEffect(() => {
    const el = tipRef.current
    if (!el || !tip) return
    const r = el.getBoundingClientRect()
    let x = 0
    if (r.right > window.innerWidth - EDGE) x = window.innerWidth - EDGE - r.right
    if (r.left + x < EDGE) x = EDGE - r.left
    const below = r.top < EDGE
    setFit((prev) => (prev.x === x && prev.below === below ? prev : { x, below }))
  }, [tip])

  if (posts.length === 0) return null

  const show = (el: HTMLElement, date: Date, dayPosts: PostMeta[]) => {
    const rect = el.getBoundingClientRect()
    setTip({ date, posts: dayPosts, left: rect.left, top: rect.top, bottom: rect.bottom, vh: window.innerHeight })
    setFit({ x: 0, below: false })
  }

  const labelOf = (day: Date, dayPosts: PostMeta[]) =>
    `${format(day, 'yyyy 年 M 月 d 日', { locale: zhCN })} · ${dayPosts.length} 篇：${dayPosts.map((p) => p.title).join('、')}`

  return (
    <div style={{ cursor: 'default' }}>
      <div className="flex flex-wrap gap-x-8 gap-y-5">
        {months.map(({ days, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="eyebrow leading-none mb-2">{label}</span>
            <div
              className="grid"
              style={{ gap: 'var(--cal-gap)', gridTemplateColumns: 'repeat(7, var(--cal-day))' }}
            >
              {days.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} style={{ width: 'var(--cal-day)', height: 'var(--cal-day)' }} />

                const key = format(day, 'yyyy-MM-dd')
                const dayPosts = datePostsMap.get(key) ?? []
                const hasPost = dayPosts.length > 0
                const only = dayPosts.length === 1 ? dayPosts[0] : null

                const cellStyle: React.CSSProperties = {
                  width: 'var(--cal-day)',
                  height: 'var(--cal-day)',
                  background: day > new Date()
                    ? 'transparent'
                    : hasPost
                      ? (dayPosts.length > 1 ? 'var(--heat-2)' : 'var(--heat-1)')
                      : 'var(--heat-0)',
                  borderRadius: 'var(--radius-xs)',
                }
                const events = {
                  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => show(e.currentTarget, day, dayPosts),
                  onMouseLeave: () => setTip(null),
                  onFocus: (e: React.FocusEvent<HTMLElement>) => show(e.currentTarget, day, dayPosts),
                  onBlur: () => setTip(null),
                }

                // 一天一篇 → 格子本身就是那条文章的链接，键盘停上去既进文章也召出浮层。
                if (only) {
                  return (
                    <Link
                      key={key}
                      href={`/posts/${only.slug}`}
                      style={cellStyle}
                      className="block transition-transform hover:scale-150 hover:z-10 relative"
                      aria-label={labelOf(day, dayPosts)}
                      {...events}
                    />
                  )
                }

                return (
                  <div
                    key={key}
                    style={cellStyle}
                    className={`transition-transform relative ${hasPost ? 'hover:scale-150 hover:z-10' : ''}`}
                    title={hasPost ? undefined : format(day, 'M月d日', { locale: zhCN })}
                    {...(hasPost ? events : {})}
                  >
                    {hasPost && <span className="sr-only">{labelOf(day, dayPosts)}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip：读屏内容由格子自己的 aria-label / sr-only 承担，这块只对眼睛存在。 */}
      {tip && createPortal(
        <div
          ref={tipRef}
          aria-hidden="true"
          className="fixed z-50 overlay rounded px-3.5 py-2.5 text-xs pointer-events-none animate-scale-in"
          style={{
            left: tip.left + 16 + fit.x,
            // max-content 是给测量用的：shrink-to-fit（含 fit-content）会把宽度算成
            // 「视口右沿 − left」，于是往左挪反而让它变宽，右沿永远贴着视口，留白夹不出来。
            width: 'max-content',
            maxWidth: 'min(320px, calc(100vw - 24px))',
            ...(fit.below ? { top: tip.bottom + GAP } : { top: 'auto', bottom: tip.vh - tip.top + GAP }),
          }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
            {format(tip.date, 'yyyy 年 M 月 d 日', { locale: zhCN })}
          </p>
          {tip.posts.map((p) => (
            <p key={p.slug} className="leading-relaxed" style={{ color: 'var(--body)' }}>
              {p.title}
            </p>
          ))}
        </div>,
        document.body
      )}

      <div
        className="flex items-center gap-5 mt-6 pt-4 meta"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        {LEGEND.map(({ heat, label }) => (
          <span key={label} className="flex items-center gap-2">
            <span className="w-3 h-3 inline-block" style={{ background: heat, borderRadius: 'var(--radius-xs)' }} /> {label}
          </span>
        ))}
        <span className="ml-auto">{posts.length} 篇</span>
      </div>
    </div>
  )
}
