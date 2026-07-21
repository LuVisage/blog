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

const MONTH_COUNT = 6 // Show last 6 months
const DAY_SIZE = 12   // px per day cell

export function PostsCalendar({ posts }: Props) {
  const [tooltip, setTooltip] = useState<{ date: Date; posts: PostMeta[]; x: number; y: number } | null>(null)

  // Build date → posts map
  const datePostsMap = useMemo(() => {
    const map = new Map<string, PostMeta[]>()
    posts.forEach((post) => {
      const key = format(parseISO(post.date), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(post)
    })
    return map
  }, [posts])

  // Generate months grid
  const months = useMemo(() => {
    const today = new Date()
    const result: { month: Date; days: Date[]; label: string }[] = []

    for (let i = MONTH_COUNT - 1; i >= 0; i--) {
      const monthDate = subMonths(today, i)
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const days = eachDayOfInterval({ start, end })
      // Pad start to align weekdays
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

  return (
    <div className="rounded-2xl glass-card p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <IconCalendar size={15} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
          文章日历
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-auto">
          {posts.length} 篇
        </span>
      </div>

      {/* Month rows */}
      <div className="flex flex-wrap gap-5">
        {months.map(({ month, days, label }) => (
          <div key={label} className="flex flex-col gap-1">
            {/* Month label */}
            <span className="text-[11px] text-gray-600 dark:text-gray-400 leading-none mb-0.5">
              {label}
            </span>
            {/* Day cells */}
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
                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                    className={`rounded-[2px] transition-all hover:scale-150 hover:ring-1 hover:ring-gray-400 hover:z-10 relative ${
                      isFuture
                        ? 'bg-transparent'
                        : hasPost
                          ? dayPosts.length > 1
                            ? 'bg-gray-700 dark:bg-gray-200 ring-1 ring-gray-400/50'
                            : 'bg-gray-500 dark:bg-gray-400'
                          : 'bg-gray-200 dark:bg-gray-700 ring-1 ring-gray-300/50 dark:ring-gray-600/30'
                    }`}
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
          className="fixed z-50 bg-white dark:bg-white/10 border border-white/10 dark:border-white/10 rounded-xl shadow-xl px-3 py-2 text-xs pointer-events-none animate-scale-in"
          style={{ left: tooltip.x + 16, top: tooltip.y - 8, transform: 'translateY(-100%)' }}
        >
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
            {format(tooltip.date, 'yyyy 年 M 月 d 日', { locale: zhCN })}
          </p>
          {tooltip.posts.map((p) => (
            <p key={p.slug} className="leading-relaxed" style={{ color: 'var(--color-ink)' }}>
              {p.title}
            </p>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-[2px] bg-gray-200 dark:bg-gray-700 ring-1 ring-gray-300/50 dark:ring-gray-600/30 inline-block" /> 无
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-[2px] bg-gray-500 dark:bg-gray-400 inline-block" /> 1 篇
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-[2px] bg-gray-700 dark:bg-gray-200 inline-block" /> 多篇
        </span>
      </div>
    </div>
  )
}
