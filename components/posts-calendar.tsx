'use client'

import { useState, useMemo } from 'react'
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
const DAY_SIZE = 13

export function PostsCalendar({ posts }: Props) {
  const [tooltip, setTooltip] = useState<{ date: Date; posts: PostMeta[]; x: number; y: number } | null>(null)

  const datePostsMap = useMemo(() => {
    const map = new Map<string, PostMeta[]>()
    posts.forEach((post) => {
      const key = format(parseISO(post.date), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(post)
    })
    return map
  }, [posts])

  const months = useMemo(() => {
    const today = new Date()
    const result: { days: (Date | null)[]; label: string }[] = []

    for (let i = MONTH_COUNT - 1; i >= 0; i--) {
      const monthDate = subMonths(today, i)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const days = eachDayOfInterval({ start, end })
      const startDay = getDay(start)
      const padded = [...Array(startDay).fill(null), ...days] as (Date | null)[]

      result.push({
        days: padded,
        label: format(monthDate, 'M月', { locale: zhCN }),
      })
    }

    return result
  }, [])

  const postDates = useMemo(() => new Set(datePostsMap.keys()), [datePostsMap])

  if (posts.length === 0) return null

  const getCellStyle = (hasPost: boolean, isMulti: boolean): React.CSSProperties => {
    if (!hasPost) return { background: 'var(--heat-0)' }
    return { background: isMulti ? 'var(--heat-2)' : 'var(--heat-1)' }
  }

  return (
    <div style={{ cursor: 'default' }}>
      <div className="flex flex-wrap gap-x-8 gap-y-5">
        {months.map(({ days, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="eyebrow leading-none mb-2">{label}</span>
            <div
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: `repeat(7, ${DAY_SIZE}px)` }}
            >
              {days.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} style={{ width: DAY_SIZE, height: DAY_SIZE }} />

                const key = format(day, 'yyyy-MM-dd')
                const hasPost = postDates.has(key)
                const dayPosts = datePostsMap.get(key) || []
                const isFuture = day > new Date()

                return (
                  <div
                    key={key}
                    style={{
                      width: DAY_SIZE,
                      height: DAY_SIZE,
                      ...(isFuture ? { background: 'transparent' } : getCellStyle(hasPost, dayPosts.length > 1)),
                      borderRadius: 3,
                      cursor: hasPost ? 'pointer' : 'default',
                    }}
                    className="transition-transform hover:scale-150 hover:z-10 relative"
                    title={hasPost
                      ? `${format(day, 'yyyy年M月d日', { locale: zhCN })}\n${dayPosts.map((p) => p.title).join('\n')}`
                      : format(day, 'M月d日', { locale: zhCN })
                    }
                    onMouseEnter={(e) => {
                      if (hasPost) {
                        const rect = (e.target as HTMLElement).getBoundingClientRect()
                        setTooltip({ date: day, posts: dayPosts, x: rect.left, y: rect.top })
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 overlay rounded-[10px] px-3.5 py-2.5 text-xs pointer-events-none animate-scale-in"
          style={{ left: tooltip.x + 16, top: tooltip.y - 8, transform: 'translateY(-100%)' }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>
            {format(tooltip.date, 'yyyy 年 M 月 d 日', { locale: zhCN })}
          </p>
          {tooltip.posts.map((p) => (
            <p key={p.slug} className="leading-relaxed" style={{ color: 'var(--body)' }}>
              {p.title}
            </p>
          ))}
        </div>
      )}

      {/* Legend */}
      <div
        className="flex items-center gap-5 mt-6 pt-4 meta"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block" style={{ background: 'var(--heat-0)', borderRadius: 3 }} /> 未更新
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block" style={{ background: 'var(--heat-1)', borderRadius: 3 }} /> 1 篇
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block" style={{ background: 'var(--heat-2)', borderRadius: 3 }} /> 多篇
        </span>
        <span className="ml-auto">{posts.length} 篇</span>
      </div>
    </div>
  )
}
