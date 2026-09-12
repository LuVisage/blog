/**
 * Course identity and URL building — the part of the curriculum a client bundle
 * is allowed to import. `lib/curriculum.ts` reads lesson files off disk, so
 * pulling `lessonHref` from there drags `fs` into the browser.
 */
export const COURSES = {
  agent: { directory: 'agent', path: '/learn/agent' },
  csp: { directory: 'csp', path: '/learn/csp' },
} as const

export type CourseId = keyof typeof COURSES

export const COURSE_IDS = Object.keys(COURSES) as CourseId[]

/** `day` entries are the sequenced lessons; `reference` entries stand beside them. */
export type PageKind = 'day' | 'reference'

export function lessonHref(course: CourseId, slug: string): string {
  return `${COURSES[course].path}/${slug}`
}
