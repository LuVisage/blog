'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { GISCUS_CONFIG } from '@/lib/constants'

function getGiscusTheme(theme?: string) {
  return theme === 'dark' ? 'dark_dimmed' : 'light'
}

/** idle = 还没滚动到评论区 | loading = 正在加载 Giscus | ready = 已加载 | error = 加载失败 */
type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<LoadStatus>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef(resolvedTheme)

  // Keep theme ref in sync (avoids stale closure in IntersectionObserver callback)
  useEffect(() => {
    themeRef.current = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    setMounted(true)
  }, [])

  // ──────────────────────────────────────
  // 1. Intersection Observer — lazy load
  // ──────────────────────────────────────
  useEffect(() => {
    if (!mounted || status !== 'idle') return

    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatus('loading')
          loadGiscus()
          observer.disconnect()
        }
      },
      { rootMargin: '200px' } // start loading 200px before visible
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted, status])

  // ──────────────────────────────────────
  // 2. Load Giscus script (runs once)
  // ──────────────────────────────────────
  function loadGiscus() {
    const container = document.getElementById('giscus-container')
    if (!container) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', GISCUS_CONFIG.repo)
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId)
    script.setAttribute('data-category', GISCUS_CONFIG.category)
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId)
    script.setAttribute('data-mapping', GISCUS_CONFIG.mapping)
    script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled)
    script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata)
    script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition)
    script.setAttribute('data-lang', GISCUS_CONFIG.lang)
    script.setAttribute('data-theme', getGiscusTheme(themeRef.current))
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    script.onload = () => setStatus('ready')
    script.onerror = () => setStatus('error')

    container.appendChild(script)
  }

  // ──────────────────────────────────────
  // 3. Theme change → postMessage (no iframe destroy!)
  // ──────────────────────────────────────
  useEffect(() => {
    if (status !== 'ready') return

    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe.giscus-frame'
    )
    iframe?.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: getGiscusTheme(resolvedTheme),
          },
        },
      },
      'https://giscus.app'
    )
  }, [resolvedTheme, status])

  // ──────────────────────────────────────
  // Render
  // ──────────────────────────────────────

  // SSR / hydration guard
  if (!mounted) {
    return (
      <>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          评论
        </h2>
        <div className="space-y-4 animate-pulse">
          <div className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </>
    )
  }

  return (
    <div ref={containerRef}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        评论
      </h2>

      {/* Loading skeleton */}
      {status === 'loading' && (
        <div className="space-y-4 animate-pulse">
          <div className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800" />
        </div>
      )}

      {/* Idle hint — user hasn't scrolled near comments yet */}
      {status === 'idle' && (
        <div className="text-center py-10 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            💬 滚动到此处加载评论区
          </span>
        </div>
      )}

      {/* Error fallback */}
      {status === 'error' && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm rounded-xl border border-dashed border-red-200 dark:border-red-800">
          <p>评论区加载失败，请刷新页面重试</p>
        </div>
      )}

      {/* Giscus mounts here */}
      <div
        id="giscus-container"
        className={status === 'ready' ? '' : 'hidden'}
      />
    </div>
  )
}
