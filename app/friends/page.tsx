import type { Metadata } from 'next'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { SITE, FRIENDS } from '@/lib/constants'
import { PageMasthead } from '@/components/page-masthead'
import { FriendsSection } from '@/components/about-sections'

export const metadata: Metadata = {
  title: '友链',
  description: `友情链接 - ${SITE.title}`,
  alternates: { canonical: '/about/' },
}

/** 深链页：内容并入 /about#friends，交换友链的入口留在这里。 */
export default function FriendsPage() {
  return (
    <div>
      <PageMasthead
        eyebrow="友链 — Friends"
        title="友链"
        lead="同道中人的博客。写 AI、写工程、写生活，都值得一读。"
        counter={FRIENDS.length > 0 ? `${FRIENDS.length} 位朋友` : '欢迎交换'}
        actions={
          <Link href="/about" className="btn-secondary h-10 px-3 text-sm">
            关于我
            <IconArrowRight size={14} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
          </Link>
        }
      />
      <div className="max-w-[820px]">
        <FriendsSection />
      </div>
    </div>
  )
}