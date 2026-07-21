'use client'

import { IconAlertTriangle } from '@tabler/icons-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md">
        <IconAlertTriangle
          size={48}
          strokeWidth={1.5}
          style={{ color: 'var(--color-danger)' }}
          className="mx-auto mb-4"
        />
        <h2 className="heading-2 mb-2">出了点问题</h2>
        <p className="body-sm mb-6">
          页面加载时发生了错误。请稍后重试。
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary text-sm">
            重试
          </button>
          <Link href="/" className="btn-ghost text-sm">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
