import type { Metadata } from 'next'
import { SITE, FRIENDS, EMAIL_OBFUSCATED } from '@/lib/constants'
import { ObfuscatedEmailIcon } from '@/components/obfuscated-email'
import { PageMasthead } from '@/components/page-masthead'
import { LedgerRow, Ledger } from '@/components/ledger-row'
import { AnimatedContent } from '@/components/ui/animated-content'
import { EmptyState } from '@/components/ui/empty-state'
import { IconLink, IconUsers } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: '友链',
  description: `友情链接 - ${SITE.title}`,
}

function Host({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4">
      <div className="eyebrow mb-1.5">{label}</div>
      <div className="font-mono text-sm" style={{ color: 'var(--ink)' }}>{value}</div>
    </div>
  )
}

export default function FriendsPage() {
  return (
    <div>
      <PageMasthead
        eyebrow="友链 — Friends"
        title="友链"
        lead="同道中人的博客。写 AI、写工程、写生活，都值得一读。"
        counter={`${FRIENDS.length} 位朋友`}
      />

      {FRIENDS.length > 0 ? (
        <AnimatedContent direction="up">
          <div className="mb-14">
            <div className="eyebrow mb-5">站点</div>
            <Ledger>
              {FRIENDS.map((friend, i) => (
                <LedgerRow
                  key={friend.url}
                  ordinal={i + 1}
                  href={friend.url}
                  external
                  title={friend.name}
                  desc={friend.description}
                  lead={
                    friend.avatar ? (
                      <span
                        className="block w-9 h-9 overflow-hidden"
                        style={{ border: '1px solid var(--line-strong)', borderRadius: 4 }}
                      >
                        <img src={friend.avatar} alt="" className="w-full h-full object-cover" />
                      </span>
                    ) : undefined
                  }
                />
              ))}
            </Ledger>
          </div>
        </AnimatedContent>
      ) : (
        <EmptyState
          icon={<IconUsers size={30} strokeWidth={1.25} />}
          title="还没有友链"
          description="在 lib/constants.ts 中配置 FRIENDS，第一位朋友随时可以加上"
        />
      )}

      <AnimatedContent direction="up" delay={0.1}>
        <section>
          <div className="eyebrow mb-2">交换</div>
          <h2 className="section-title mb-6">交换友链</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-14 items-start">
            <p className="body-md max-w-xl">
              如果你也在写 AI、Agent 或工程实践方向的博客，欢迎交换友链。
              把站点的名称、简介和 RSS 发给我，我会连同你的信息一起登记在下面这份资料里。
            </p>
            <div style={{ borderTop: '1px solid var(--line-strong)' }}>
              <Host label="名称" value={SITE.title} />
              <div className="rule" />
              <Host label="地址" value={SITE.url} />
              <div className="rule" />
              <Host label="RSS" value={`${SITE.url}/rss.xml`} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-8">
            <IconLink size={15} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
            <ObfuscatedEmailIcon
              encoded={EMAIL_OBFUSCATED}
              label="邮件"
              className="body-sm underline underline-offset-2 transition-colors hover:text-[var(--accent-text)]"
              style={{ color: 'var(--accent-text)' }}
            >
              发邮件给我
            </ObfuscatedEmailIcon>
          </div>
        </section>
      </AnimatedContent>
    </div>
  )
}
