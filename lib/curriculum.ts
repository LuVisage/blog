import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { estimateReadingTime } from './posts'
import { isNotFound } from './is-not-found'
import { COURSES, type CourseId, type PageKind } from './courses'

/**
 * Two courses share one reader. Everything that used to assume a single
 * `day-NN` sequence now takes a course id, because both courses use the same
 * slugs and only the directory separates them.
 *
 * The ids, paths and href builder live in `./courses`: this module reads from
 * disk, so a client component importing `lessonHref` from here would pull `fs`
 * into the browser bundle.
 */
export { COURSES, COURSE_IDS, lessonHref } from './courses'
export type { CourseId, PageKind } from './courses'

export interface LessonMeta {
  slug: string
  course: CourseId
  kind: PageKind
  day: number
  week: number
  weekTitle: string
  weekBlurb: string
  title: string
  lead: string
  examples: string[]
  sourcePath: string
  readingTime: number
}

export interface Lesson extends LessonMeta {
  content: string
}

export interface Week {
  week: number
  title: string
  blurb: string
  lessons: LessonMeta[]
}

/** The generated component tags carry prose that shouldn't count as reading time. */
function stripComponentTags(content: string): string {
  return content.replace(/^<(Quiz|GotchaTable|DayComplete|Checklist)\b.*$/gm, '')
}

/**
 * 读一个 .mdx 源文件。不存在返回 null，其他读取失败照抛，
 * 免得一个坏文件被静默当成「这门课还没有内容」。
 */
function readSource(filePath: string): string | null {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch (err) {
    if (!isNotFound(err)) throw err
    return null
  }
}

function parseLesson(course: CourseId, filename: string, raw: string): Lesson {
  const { data, content } = matter(raw)
  const slug = data.slug || filename.replace(/\.mdx$/, '')
  return {
    slug,
    course,
    kind: data.kind === 'reference' ? 'reference' : 'day',
    day: Number(data.day ?? 0),
    week: Number(data.week ?? 0),
    weekTitle: data.weekTitle || `第 ${data.week} 周`,
    weekBlurb: data.weekBlurb || '',
    title: data.title || slug,
    lead: data.lead || '',
    examples: Array.isArray(data.examples) ? data.examples : [],
    sourcePath: data.sourcePath || '',
    readingTime: estimateReadingTime(stripComponentTags(content)),
    content,
  }
}

function lessonsDirectory(course: CourseId): string {
  return join(process.cwd(), 'content', 'curriculum', COURSES[course].directory)
}

function readAll(course: CourseId): Lesson[] {
  const dir = lessonsDirectory(course)
  let files: string[]
  try {
    files = readdirSync(dir)
  } catch (err) {
    // 目录还没导入过是真·没有课；其他读取失败要让构建停下来，而不是渲染一个 0 课的页面。
    if (!isNotFound(err)) throw err
    return []
  }
  return files.flatMap((f) => {
    if (!f.endsWith('.mdx')) return []
    const raw = readSource(join(dir, f))
    return raw === null ? [] : [parseLesson(course, f, raw)]
  })
}

function toMeta(lesson: Lesson): LessonMeta {
  const { content: _content, ...meta } = lesson
  return meta
}

/** The sequenced lessons, sorted by day number. */
export function getAllLessons(course: CourseId): LessonMeta[] {
  return readAll(course)
    .filter((l) => l.kind === 'day')
    .sort((a, b) => a.day - b.day)
    .map(toMeta)
}

/** Reference pages that live beside the sequence — manuals, plan sheets. */
export function getReferencePages(course: CourseId): LessonMeta[] {
  return readAll(course)
    .filter((l) => l.kind === 'reference')
    .sort((a, b) => a.day - b.day)
    .map(toMeta)
}

/**
 * Slugs are the filename, and they reach `generateStaticParams`, so the pattern
 * is what stops an arbitrary path from being read off disk.
 */
const SLUG = /^[a-z0-9-]+$/

export function getLessonBySlug(course: CourseId, slug: string): Lesson | null {
  if (!SLUG.test(slug)) return null
  const filename = `${slug}.mdx`
  const raw = readSource(join(lessonsDirectory(course), filename))
  // null 只可能是「没有这个文件」，交给路由渲染 404。
  return raw === null ? null : parseLesson(course, filename, raw)
}

/** Lessons grouped into weeks, week 0 first. */
export function getWeeks(course: CourseId): Week[] {
  const groups = new Map<number, LessonMeta[]>()
  for (const lesson of getAllLessons(course)) {
    const list = groups.get(lesson.week)
    if (list) list.push(lesson)
    else groups.set(lesson.week, [lesson])
  }
  return Array.from(groups.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([week, lessons]) => ({ week, title: lessons[0].weekTitle, blurb: lessons[0].weekBlurb, lessons }))
}

export function getAdjacentLessons(course: CourseId, slug: string): {
  prev: LessonMeta | null
  next: LessonMeta | null
} {
  const lessons = getAllLessons(course)
  const index = lessons.findIndex((l) => l.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index < lessons.length - 1 ? lessons[index + 1] : null,
  }
}

export function getWeekLessons(course: CourseId, week: number): LessonMeta[] {
  return getAllLessons(course).filter((l) => l.week === week)
}

export function getCurriculumStats(course: CourseId) {
  const lessons = getAllLessons(course)
  return {
    lessons: lessons.length,
    weeks: new Set(lessons.map((l) => l.week)).size,
    minutes: lessons.reduce((sum, l) => sum + l.readingTime, 0),
  }
}
