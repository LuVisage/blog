'use client'

import { useEffect, useRef, useState } from 'react'
import { init } from '@waline/client'
import type { WalineInstance } from '@waline/client'
import '@waline/client/style'

interface WalineCommentsProps {
  serverURL: string
  dark?: string | boolean
  lang?: string
}

export function WalineComments({
  serverURL,
  dark = 'html.dark',
  lang = 'zh-CN',
}: WalineCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const walineRef = useRef<WalineInstance | null>(null)
  const [initFailed, setInitFailed] = useState(false)
  const initCalled = useRef(false)

  useEffect(() => {
    if (!containerRef.current || initCalled.current) return
    initCalled.current = true

    try {
      walineRef.current = init({
        el: containerRef.current,
        serverURL,
        path: window.location.pathname,
        lang,
        dark,
        emoji: [
          'https://unpkg.com/@waline/emojis@1.1.0/weibo',
        ],
        meta: ['nick', 'mail', 'link'],
        requiredMeta: ['nick'],
        pageSize: 10,
      })
    } catch {
      setInitFailed(true)
    }

    return () => {
      walineRef.current?.destroy()
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        评论
      </h2>
      {initFailed && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm rounded-xl border border-dashed border-pink-200 dark:border-pink-800">
          <p>评论区加载失败，请刷新页面重试</p>
        </div>
      )}
      <div ref={containerRef} />
    </div>
  )
}
