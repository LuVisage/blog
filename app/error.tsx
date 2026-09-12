'use client'

import { IconRefresh, IconAlertTriangle } from '@tabler/icons-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <div
        className="flex items-center justify-between gap-4 py-2.5"
        style={{ borderTop: '1px solid var(--line-strong)', borderBottom: '1px solid var(--line)' }}
      >
        <span className="eyebrow">错误 500 — Server Error</span>
        <span className="eyebrow" style={{ color: 'var(--danger)' }}>渲染失败</span>
      </div>

      <div className="pt-10 sm:pt-12 max-w-xl">
        <h1 className="heading-1 mb-5">这一页没能渲染出来。</h1>
        <p className="body-md mb-8">
          构建或渲染时抛出了异常。重试通常就够了；如果一直失败，
          请把下面的错误标识一起反馈给站点作者。
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button onClick={reset} className="btn-primary">
            <IconRefresh size={16} strokeWidth={1.75} />
            重试
          </button>
          <Link href="/" className="btn-secondary">回到首页</Link>
        </div>

        {error.digest && (
          <div className="flex items-start gap-3 py-4 rule">
            <IconAlertTriangle size={16} strokeWidth={1.75} className="mt-0.5" style={{ color: 'var(--danger)' }} />
            <div>
              <div className="eyebrow mb-1">错误标识</div>
              <code className="font-mono text-sm" style={{ color: 'var(--body)' }}>{error.digest}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
