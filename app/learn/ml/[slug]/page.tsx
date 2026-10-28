import { notFound } from 'next/navigation'
import { getLessonBySlug } from '@/lib/curriculum'
import { coursePageSlugs, lessonMetadata } from '@/lib/lesson-page'
import { LessonView } from '@/components/learn/lesson-view'

type PageParams = Promise<{ slug: string }>

export function generateStaticParams() {
  return coursePageSlugs('ml').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params
  return lessonMetadata('ml', slug)
}

export default async function LessonPage({ params }: { params: PageParams }) {
  const { slug } = await params
  const lesson = getLessonBySlug('ml', slug)
  if (!lesson) notFound()
  return <LessonView lesson={lesson} />
}
