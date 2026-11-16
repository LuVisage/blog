import type { Metadata } from 'next'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { SITE, PROJECTS } from '@/lib/constants'
import { PageMasthead } from '@/components/page-masthead'
import { ProjectsSection } from '@/components/about-sections'

export const metadata: Metadata = {
  title: '项目',
  description: `项目作品 - ${SITE.title}`,
  alternates: { canonical: '/about/' },
}

/** 深链页：内容并入 /about#projects，旧链接与站外引用照旧可用。 */
export default function ProjectsPage() {
  return (
    <div>
      <PageMasthead
        eyebrow="项目 — Projects"
        title="项目"
        lead="写过、用过、还在维护的东西。链接指向公开仓库。"
        counter={`${PROJECTS.length} 个项目`}
        actions={
          <Link href="/about" className="btn-secondary h-10 px-3 text-sm">
            关于我
            <IconArrowRight size={14} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
          </Link>
        }
      />
      <div className="max-w-[820px]">
        <ProjectsSection />
      </div>
    </div>
  )
}