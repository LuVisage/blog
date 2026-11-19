import Link from 'next/link'
import { Suspense } from 'react'
import type { MDXComponents } from 'mdx/types'
import { IconArrowLeft, IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import {
  COURSES,
  getAdjacentLessons,
  getWeekLessons,
  lessonHref,
  type CourseId,
  type Lesson,
  type LessonMeta,
} from '@/lib/curriculum'
import { getSimSpecs } from '@/lib/sim/registry'
import { MDXContent } from '@/components/mdx-content'
import { InlineMd } from '@/components/inline-md'
import { CodeBlockEnhancer } from '@/components/code-block-enhancer'
import { TableOfContents } from '@/components/toc'
import { ChapterBar } from '@/components/chapter-bar'
import { ReadingProgress } from '@/components/ui/reading-progress'
import { Quiz } from '@/components/learn/quiz'
import { Checklist } from '@/components/learn/checklist'
import { GotchaTable } from '@/components/learn/gotcha-table'
import { DayComplete } from '@/components/learn/day-complete'
import { WeekStrip } from '@/components/learn/week-strip'
import { SimulatorClient } from '@/components/learn/simulator-client'

/**
 * 所有课程共用的课时正文。课程归属写在 lesson 自身，这里不会猜错目录。
 */

// 115/268 课的 lead 与正文开篇逐字相同或为其前缀（写作层遗留）：渲染期去重，content/ 不动。
// 比前 3 段、含/不含引用块两路都比：lead 可能复读首段，也可能是开篇 callout 的前缀。
function leadRepeatsBody(lead: string, content: string): boolean {
  const norm = (t: string) =>
    t.replace(/\]\([^)]*\)/g, '').replace(/[*`#[\]]/g, '').replace(/\s+/g, '')
  const openings = (keepQuote: boolean) =>
    content
      .split(/\r?\n/)
      .filter((l) => !/^(---|#+\s|<)/.test(l.trim()))
      .filter((l) => keepQuote || !/^>/.test(l.trim()))
      .map((l) => l.replace(/^>\s?/, ''))
      .join('\n')
      .trim()
      .split(/\r?\n\r?\n/)
      .slice(0, 3)
      .map(norm)
  const n = norm(lead)
  return [...openings(true), ...openings(false)].some((o) => o === n || o.startsWith(n))
}

// 标题里的「…」引语染信号红，与文章页同一套巨字签名细节。
function renderTitle(title: string) {
  return title.split(/(「[^」]*」)/g).map((part, i) =>
    part.startsWith('「') && part.endsWith('」')
      ? <span key={i} className="q">{part}</span>
      : <span key={i}>{part}</span>
  )
}

/**
 * 实验台的 Suspense 兜底：`next/dynamic` + `ssr: false` 不参与服务端渲染，
 * 边界必须自己能画出东西。
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

/** 上一课 / 下一课共用一张卡，只有方向相关的类与箭头不同。 */
function LessonHop({ course, lesson, direction }: { course: CourseId; lesson: LessonMeta; direction: 'prev' | 'next' }) {
  const back = direction === 'prev'
  const Chevron = back ? IconChevronLeft : IconChevronRight
  return (
    <Link
      href={lessonHref(course, lesson.slug)}
      className={
        back
          ? 'group flex flex-col gap-2 py-5 sm:pr-8 sm:border-r border-t-[color:var(--line-strong)] border-b-[color:var(--line)] sm:border-r-[color:var(--line)]'
          : 'group flex flex-col gap-2 py-5 sm:pl-8 sm:text-right border-t-[color:var(--line-strong)] border-b-[color:var(--line)]'
      }
    >
      <span
        className={
          back
            ? 'eyebrow inline-flex items-center gap-1.5'
            : 'eyebrow inline-flex sm:flex-row-reverse items-center gap-1.5'
        }
      >
        <Chevron
          size={13}
          strokeWidth={2}
          className={back ? 'transition-transform group-hover:-translate-x-0.5' : 'transition-transform group-hover:translate-x-0.5'}
        />
        Day {lesson.day}
      </span>
      <span className="text-sm line-clamp-2" style={{ color: 'var(--body)' }}>
        {lesson.title}
      </span>
    </Link>
  )
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  const course = lesson.course
  const root = COURSES[course].path
  /** 随查手册不在序列里：没有周次，也没有天编号。 */
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
          <header className="pt-9 sm:pt-12">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 eyebrow">
              {!reference && weekLessons.length < 2 && (
                <>
                  <Link
                    href={root}
                    className="eyebrow eyebrow-accent inline-flex min-h-6 items-center hover:underline underline-offset-4"
                  >
                    {lesson.week === 0 ? '环境日' : `第 ${lesson.week} 周`}
                  </Link>
                  <span style={{ color: 'var(--faint)' }}>/</span>
                </>
              )}
              <span>{reference ? '随查手册' : `Day ${lesson.day}`}</span>
              <span style={{ color: 'var(--faint)' }}>/</span>
              <span>{lesson.readingTime} 分钟</span>
            </div>

            <h1 className="ptitle">{renderTitle(lesson.title)}</h1>

            {lesson.lead && !leadRepeatsBody(lesson.lead, lesson.content) && (
              <p className="body-lg lead-md mt-5 max-w-2xl" style={{ color: 'var(--muted)' }}>
                <InlineMd text={lesson.lead} />
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
                    style={{ color: 'var(--body)', borderRadius: 'var(--radius-xs)' }}
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
                  className="eyebrow inline-flex min-h-6 items-center gap-1.5 transition-colors hover:text-[var(--accent-text)] tint-accent"
                >
                  本课 {specs.length} 个可动手实验台 · 在正文末尾
                </a>
              </div>
            )}

            <div className="phead-rule" aria-hidden="true" />
          </header>

          {/* 窄屏常驻阅读定位条，与文章页同一套语汇。 */}
          <div className="mt-8 mb-8 xl:mb-0">
            <ChapterBar />
          </div>

          {/* 行长由 .prose 的 --measure 决定，这里不再叠宽度类。 */}
          <div className="prose mx-0 mb-14">
            <CodeBlockEnhancer>
              <MDXContent source={lesson.content} components={components} />
            </CodeBlockEnhancer>
          </div>

          {/* tabIndex=-1：页内跳转「本课 N 个实验台」要有可聚焦落点，焦点才真的交过来；
              否则只改 hash，焦点留在 BODY，下一跳 Tab 回页头。 */}
          {specs.length > 0 && (
            <section id="labs" tabIndex={-1} className="mb-14" style={{ scrollMarginTop: '5rem' }} aria-label="本课实验台">
              <Suspense fallback={<LabSkeleton count={specs.length} />}>
                <SimulatorClient specs={specs} />
              </Suspense>
            </section>
          )}

          {(prev || next) && (
            <nav className="grid grid-cols-1 sm:grid-cols-2 mb-10">
              {prev ? <LessonHop course={course} lesson={prev} direction="prev" /> : <span />}
              {next && <LessonHop course={course} lesson={next} direction="next" />}
            </nav>
          )}
        </article>

        <aside className="hidden xl:flex xl:flex-col xl:w-56 xl:flex-shrink-0 xl:self-stretch">
          <div className="sticky top-24 self-start flex flex-col w-full max-h-[calc(100vh-8rem)] py-5">
            <TableOfContents variant="desktop" />
            {next && (
              <Link
                href={lessonHref(course, next.slug)}
                className="btn-secondary mt-6 w-full inline-flex items-center justify-between gap-2 px-3 py-2 text-xs transition-colors flex-none tint-body"
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
