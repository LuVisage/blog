import Link from 'next/link'
import { NAV_LINKS } from '@/lib/constants'

export default function NotFound() {
  return (
    <div>
      <div
        className="flex items-center justify-between gap-4 py-2.5"
        style={{ borderTop: '1px solid var(--line-strong)', borderBottom: '1px solid var(--line)' }}
      >
        <span className="eyebrow">错误 404 — Not Found</span>
        <span className="eyebrow eyebrow-accent">此路不通</span>
      </div>

      <div className="pt-10 sm:pt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-14 items-start">
        <div>
          <h1
            className="font-serif font-bold"
            style={{ fontSize: 'clamp(72px, 16vw, 160px)', lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--ink)' }}
          >
            404
          </h1>
          <p className="heading-2 mt-6">这个地址上没有内容。</p>
          <p className="body-md mt-3 max-w-md">
            页面可能改名了、删掉了，或者链接里有一个字符不对。
            下面的栏目都在正常运作，从那里进去更可靠。
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link href="/" className="btn-primary">回到首页</Link>
            <Link href="/posts" className="btn-secondary">全部文章</Link>
            <Link href="/archive" className="btn-ghost">按时间翻</Link>
          </div>
        </div>

        <nav aria-label="站点栏目">
          <div className="eyebrow mb-4">栏目</div>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              data-spotlight="row"
              className="group flex items-baseline gap-4 py-3.5 rule"
            >
              <span className="meta tabular-nums transition-colors group-hover:text-[var(--accent-text)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="font-serif font-bold transition-colors group-hover:text-[var(--accent-text)]"
                style={{ fontSize: 18, color: 'var(--ink)' }}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <div className="rule" />
        </nav>
      </div>
    </div>
  )
}
