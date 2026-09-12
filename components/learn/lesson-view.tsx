import Link from 'next/link'
import { Suspense } from 'react'
import type { MDXComponents } from 'mdx/types'
import { IconArrowLeft, IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { COURSES, getAdjacentLessons, getWeekLessons, lessonHref, type Lesson } from '@/lib/curriculum'
import { getSimSpecs } from '@/lib/sim/registry'
import { MDXContent } from '@/components/mdx-content'
import { CodeBlockEnhancer } from '@/components/code-block-enhancer'
import { TableOfContents } from '@/components/toc'
import { FontSizeControl } from '@/components/font-size-control'
import { ReadingProgress } from '@/components/ui/reading-progress'
import { Quiz } from '@/components/learn/quiz'
import { Checklist } from '@/components/learn/checklist'
import { GotchaTable } from '@/components/learn/gotcha-table'
import { DayComplete } from '@/components/learn/day-complete'
import { WeekStrip } from '@/components/learn/week-strip'
import { SimulatorClient } from '@/components/learn/simulator-client'

/**
 * The lesson body shared by every course. Which course a lesson belongs to is
 * carried on the lesson itself, so nothing here can guess the wrong directory.
 */

/**
 * Suspense fallback for the labs. `next/dynamic` with `ssr: false` bails out of the
 * server render, so the boundary has to be able to paint something on its own.
 */
function LabSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="learn-block not-prose"
          style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 18 }}
        >
          <div className="skeleton-line" style={{ width: 160 }} />
          <div className="skeleton-line mt-3" style={{ width: '70%' }} />
          <div className="skeleton-line mt-2" style={{ width: '45%' }} />
        </div>
      ))}
    </>
  )
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  const course = lesson.course
  const root = COURSES[course].path
  /** The manuals that stand beside the sequence have no week and no day number. */
  const reference = lesson.kind === 'reference'
  const { prev, next } = getAdjacentLessons(course, lesson.slug)
  const weekLessons = getWeekLessons(course, lesson.week)
  const specs = getSimSpecs(course, lesson.slug)

  const components: MDXComponents = {
    Quiz: (props) => <Quiz course={course} slug={lesson.slug} {...props} />,
    Checklist: (props) => <Checklist course={course} slug={lesson.slug} {...props} />,
    GotchaTable,
    DayComplete: (props) => <DayComplete course={course} slug={lesson.slug} {...props} />,
  }

  return (
    <div className="py-10 sm:py-14">
      <ReadingProgress />

      {/* Top rail */}
      <div
        className="flex items-center justify-between gap-4 py-2.5"
        style={{ borderTop: '1px solid var(--line-strong)', borderBottom: '1px solid var(--line)' }}
      >
        <Link
          href={root}
          className="eyebrow inline-flex min-h-6 items-center gap-1.5 hover:text-[var(--accent-text)] transition-colors"
        >
          <IconArrowLeft size={13} strokeWidth={2} />
          教程目录
        </Link>
        <FontSizeControl />
      </div>

      <WeekStrip
        course={course}
        current={lesson.slug}
        week={lesson.week}
        weekTitle={lesson.weekTitle}
        lessons={weekLessons}
      />

      <div className="xl:flex xl:gap-10 xl:items-start">
        <article className="flex-1 min-w-0">
          <header className="pt-9 sm:pt-12 pb-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 eyebrow">
              {!reference && weekLessons.length < 2 && (
                <>
                  <Link href={root} className="eyebrow eyebrow-accent hover:underline underline-offset-4">
                    {lesson.week === 0 ? '环境日' : `第 ${lesson.week} 周`}
                  </Link>
                  <span style={{ color: 'var(--faint)' }}>/</span>
                </>
              )}
              <span>{reference ? '随查手册' : `Day ${lesson.day}`}</span>
              <span style={{ color: 'var(--faint)' }}>/</span>
              <span>{lesson.readingTime} 分钟</span>
            </div>

            <h1 className="display mt-5" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.18 }}>
              {lesson.title}
            </h1>

            {lesson.lead && (
              <p className="body-lg mt-5 max-w-2xl" style={{ color: 'var(--muted)' }}>
                {lesson.lead}
              </p>
            )}

            {lesson.examples.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-x-2 gap-y-2 mt-7 pt-5"
                style={{ borderTop: '1px solid var(--line)' }}
              >
                <span className="eyebrow mr-1">配套案例</span>
                {lesson.examples.map((file) => (
                  <span
                    key={file}
                    className="chip px-2.5 py-1 text-xs font-mono"
                    style={{ color: 'var(--body)', borderRadius: 6 }}
                  >
                    {file.replace(/^examples\//, '')}
                  </span>
                ))}
              </div>
            )}

            {specs.length > 0 && (
              <div className="mt-5">
                <a
                  href="#labs"
                  className="eyebrow inline-flex min-h-6 items-center gap-1.5 transition-colors hover:text-[var(--accent-text)]"
                  style={{ color: 'var(--accent-text)' }}
                >
                  本课 {specs.length} 个可动手实验台 · 在正文末尾
                </a>
              </div>
            )}
          </header>

          <div className="xl:hidden mb-8">
            <TableOfContents />
          </div>

          <div className="prose mx-0 max-w-[68ch] mb-14">
            <CodeBlockEnhancer>
              <MDXContent source={lesson.content} components={components} />
            </CodeBlockEnhancer>
          </div>

          {specs.length > 0 && (
            <section id="labs" className="mb-14" style={{ scrollMarginTop: '5rem' }} aria-label="本课实验台">
              <Suspense fallback={<LabSkeleton count={specs.length} />}>
                <SimulatorClient specs={specs} />
              </Suspense>
            </section>
          )}

          {(prev || next) && (
            <nav className="grid grid-cols-1 sm:grid-cols-2 mb-10">
              {prev ? (
                <Link
                  href={lessonHref(course, prev.slug)}
                  data-spotlight="row"
                  className="group flex flex-col gap-2 py-5 sm:pr-8 sm:border-r border-t-[color:var(--line-strong)] border-b-[color:var(--line)] sm:border-r-[color:var(--line)]"
                >
                  <span className="eyebrow inline-flex items-center gap-1.5">
                    <IconChevronLeft size={13} strokeWidth={2} className="transition-transform group-hover:-translate-x-0.5" />
                    Day {prev.day}
                  </span>
                  <span className="text-sm line-clamp-2" style={{ color: 'var(--body)' }}>
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={lessonHref(course, next.slug)}
                  data-spotlight="row"
                  className="group flex flex-col gap-2 py-5 sm:pl-8 sm:text-right border-t-[color:var(--line-strong)] border-b-[color:var(--line)]"
                >
                  <span className="eyebrow inline-flex sm:flex-row-reverse items-center gap-1.5">
                    <IconChevronRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                    Day {next.day}
                  </span>
                  <span className="text-sm line-clamp-2" style={{ color: 'var(--body)' }}>
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </article>

        <aside className="hidden xl:flex xl:flex-col xl:w-56 xl:flex-shrink-0 xl:self-stretch">
          <div
            className="sticky top-24 self-start w-full py-5"
            style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto', cursor: 'default' }}
          >
            <TableOfContents />
            {next && (
              <Link
                href={lessonHref(course, next.slug)}
                className="btn-secondary mt-6 w-full inline-flex items-center justify-between gap-2 px-3 py-2 text-xs transition-colors"
                style={{ color: 'var(--body)' }}
              >
                下一课
                <IconArrowRight size={13} strokeWidth={2} />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
