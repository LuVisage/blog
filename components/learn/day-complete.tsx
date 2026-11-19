import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { getAdjacentLessons, lessonHref, type CourseId } from '@/lib/curriculum'
import { MarkDone } from './mark-done'

interface DayCompleteProps {
  course: CourseId
  slug: string
  day: number
  recap: string
}

/** 每课收尾：「Day N 完成」+ 标记按钮 + 指向下一课。 */
export function DayComplete({ course, slug, day, recap }: DayCompleteProps) {
  const { next } = getAdjacentLessons(course, slug)

  return (
    <section className="mt-12 pt-8 pb-2" style={{ borderTop: '1px solid var(--line-strong)' }}>
      <div className="eyebrow mb-3">Day {day} 完成</div>
      <p className="body-lg max-w-[var(--measure)]" style={{ color: 'var(--body)' }}>
        {recap}
      </p>

      <div className="mt-7">
        <MarkDone course={course} slug={slug} label="标记本课完成" />
      </div>

      {next && (
        /* 下一课独占一行：标题长了不会被按钮挤掉；hover 走 .row-line 的行顶发丝线。 */
        <Link
          href={lessonHref(course, next.slug)}
          className="pressable row-line group mt-6 flex items-baseline gap-4 py-4 rule"
        >
          <span className="eyebrow flex-shrink-0" style={{ color: 'var(--muted)' }}>
            下一课
          </span>
          <span className="meta tabular-nums flex-shrink-0">Day {next.day}</span>
          <span className="min-w-0 flex-1 row-title text-sm font-medium transition-colors group-hover:text-[var(--accent-text)] tint-body">
            {next.title}
          </span>
          <IconArrowRight
            size={15}
            strokeWidth={2}
            className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </section>
  )
}
