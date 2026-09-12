import type { Metadata } from 'next'
import { siteUrl } from './constants'
import {
  COURSES,
  getAllLessons,
  getLessonBySlug,
  getReferencePages,
  type CourseId,
  type Lesson,
} from './curriculum'

/**
 * Page furniture every course's `[slug]` route needs. Kept out of the routes so
 * adding a course costs one thin file, and the reference pages — which have no
 * day number — are handled in exactly one place.
 */

/** The sequenced days plus the reference manuals standing beside them. */
export function coursePageSlugs(course: CourseId): string[] {
  return [...getAllLessons(course), ...getReferencePages(course)].map((l) => l.slug)
}

export function lessonHeading(lesson: Lesson): string {
  return lesson.kind === 'reference' ? lesson.title : `Day ${lesson.day} · ${lesson.title}`
}

export function lessonMetadata(course: CourseId, slug: string): Metadata {
  const lesson = getLessonBySlug(course, slug)
  if (!lesson) return {}
  const title = lessonHeading(lesson)
  const url = siteUrl(`${COURSES[course].path}/${lesson.slug}`)
  return {
    title,
    description: lesson.lead,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: lesson.lead,
      type: 'article',
      url,
      images: [{ url: siteUrl('og-default.svg'), width: 1200, height: 630, alt: title }],
    },
  }
}
