'use client'

import { useEffect, useState } from 'react'

/**
 * 站点运行天数：起算日是首篇文章的发布日（真实数据，server 侧传入），
 * 天数在客户端算 —— 静态导出若把天数烘进 HTML，部署第二天就开始说谎。
 * 首帧只渲染「自 … 起」，水合后补天数，不产 hydration mismatch。
 */
export function RunningDays({ since }: { since: string }) {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    if (!since) return
    const start = new Date(`${since.slice(0, 10)}T00:00:00`)
    setDays(Math.floor((Date.now() - start.getTime()) / 86400000) + 1)
  }, [since])

  if (!since) return null
  return (
    <span title="以首篇文章发布日计">
      自 {since.slice(0, 10).replace(/-/g, '.')} 起{days !== null ? ` · 第 ${days} 天` : ''}
    </span>
  )
}