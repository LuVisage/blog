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

/** The tutorial closes every lesson with a "Day N 完成！" line plus a pointer to tomorrow. */
export function DayComplete({ course, slug, day, recap }: DayCompleteProps) {
  const { next } = getAdjacentLessons(course, slug)

  return (
    <section
      className="mt-12 pt-8 pb-2"
      style={{ borderTop: '1px solid var(--line-strong)' }}
    >
      <div className="eyebrow mb-3">Day {day} 完成</div>
      <p className="body-lg max-w-[62ch]" style={{ color: 'var(--body)' }}>
        {recap}
      </p>

      <div className="flex flex-wrap items-center gap-4 mt-7">
        <MarkDone course={course} slug={slug} label="标记本课完成" />
        {next && (
          <Link
            href={lessonHref(course, next.slug)}
            className="group inline-flex min-h-6 items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent-text)]"
            style={{ color: 'var(--body)' }}
          >
            下一课 · Day {next.day} {next.title}
            <IconArrowRight
              size={15}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>
    </section>
  )
}
