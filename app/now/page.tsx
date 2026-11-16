import type { Metadata } from 'next'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { PageMasthead } from '@/components/page-masthead'
import { NowSection } from '@/components/about-sections'
import { getAllPosts } from '@/lib/posts'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export const metadata: Metadata = {
  title: '现在',
  description: '最近在写什么、在关注什么，以及这个站点此刻的状态。',
  alternates: { canonical: '/about/' },
}

/** 深链页：内容并入 /about#now，数字仍从本地 MDX 现算。 */
export default function NowPage() {
  const latest = getAllPosts()[0]
  const updated = latest ? format(parseISO(latest.date), 'yyyy.MM.dd', { locale: zhCN }) : '—'

  return (
    <div>
      <PageMasthead
        eyebrow="NOW · 近况"
        title="现在在做什么"
        lead="一页简短的近况快照。比「关于」更新鲜，比文章更随意。"
        counter={`最近更新 ${updated}`}
        actions={
          <Link href="/about" className="btn-secondary h-10 px-3 text-sm">
            关于我
            <IconArrowRight size={14} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
          </Link>
        }
      />
      <div className="max-w-[820px]">
        <NowSection />
      </div>
    </div>
  )
}