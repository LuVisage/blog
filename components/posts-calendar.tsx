'use client'

import { useState, useMemo } from 'react'
import type { PostMeta } from '@/lib/posts'
import { IconCalendar } from '@tabler/icons-react'
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  format, isSameDay, subMonths, parseISO, getDay,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Props {
  posts: PostMeta[]
}

const MONTH_COUNT = 6
const DAY_SIZE = 12

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
    const result: { month: Date; days: Date[]; label: string }[] = []

    for (let i = MONTH_COUNT - 1; i >= 0; i--) {
      const monthDate = subMonths(today, i)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const days = eachDayOfInterval({ start, end })
      const startDay = getDay(start)
      const padded = [...Array(startDay).fill(null), ...days] as (Date | null)[]

      result.push({
        month: monthDate,
        days: padded as Date[],
        label: format(monthDate, 'M月', { locale: zhCN }),
      })
    }

    return result
  }, [])

  const postDates = useMemo(() => new Set(datePostsMap.keys()), [datePostsMap])

  if (posts.length === 0) return null

  // Calendar day cell color based on post count
  const getCellStyle = (hasPost: boolean, isMulti: boolean): React.CSSProperties => {
    if (!hasPost) return {
      background: 'var(--color-hairline-soft)',
      boxShadow: '0 0 0 1px var(--color-hairline)',
    }
    if (isMulti) return {
      background: 'var(--color-ink)',
      boxShadow: '0 0 0 1px var(--color-border-strong)',
    }
    return {
      background: 'var(--color-muted)',
    }
  }

  return (
    <div className="rounded-2xl glass-card p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <IconCalendar size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
          文章日历
        </span>
        <span className="text-xs ml-auto" style={{ color: 'var(--color-muted)' }}>
          {posts.length} 篇
        </span>
      </div>

      <div className="flex flex-wrap gap-6">
        {months.map(({ month, days, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[11px] leading-none mb-1" style={{ color: 'var(--color-muted-soft)' }}>
              {label}
            </span>
            <div
              className="grid gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${Math.ceil(days.length / 7)}, ${DAY_SIZE}px)` }}
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
                      ...(isFuture ? {} : getCellStyle(hasPost, dayPosts.length > 1)),
                      borderRadius: 2,
                    }}
                    className="transition-all hover:scale-150 hover:z-10 relative"
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
          className="fixed z-50 glass-card rounded-xl px-3 py-2 text-xs pointer-events-none animate-scale-in"
          style={{ left: tooltip.x + 16, top: tooltip.y - 8, transform: 'translateY(-100%)' }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>
            {format(tooltip.date, 'yyyy 年 M 月 d 日', { locale: zhCN })}
          </p>
          {tooltip.posts.map((p) => (
            <p key={p.slug} className="leading-relaxed" style={{ color: 'var(--color-body)' }}>
              {p.title}
            </p>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-[10px]" style={{ color: 'var(--color-muted-soft)' }}>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-[2px] inline-block" style={{ background: 'var(--color-hairline-soft)', boxShadow: '0 0 0 1px var(--color-hairline)' }} /> 无
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-[2px] inline-block" style={{ background: 'var(--color-muted)' }} /> 1 篇
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-[2px] inline-block" style={{ background: 'var(--color-ink)' }} /> 多篇
        </span>
      </div>
    </div>
  )
}
