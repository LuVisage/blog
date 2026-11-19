'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { IconAlertTriangle, IconMessage } from '@tabler/icons-react'
import { GISCUS_CONFIG } from '@/lib/constants'

function getGiscusTheme(theme?: string) {
  return theme === 'dark' ? 'dark_dimmed' : 'light'
}

/** idle = 还没滚到评论区 | loading = 正在加载 | ready = 已加载 | error = 加载失败 */
type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24" style={{ background: 'var(--surface-2)' }} />
      <div className="h-16" style={{ background: 'var(--surface-2)' }} />
      <div className="h-16" style={{ background: 'var(--surface-2)' }} />
    </div>
  )
}

export function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<LoadStatus>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef(resolvedTheme)
  const frameLoaded = useRef(false)

  // 同步 ref：IntersectionObserver 与 iframe load 回调里闭包会过期。
  useEffect(() => {
    themeRef.current = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => setMounted(true), [])

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
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted, status])

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

  // client.js 的 onload 那一刻 iframe 往往还停在 about:blank（同源），对着它
  // postMessage 到 https://giscus.app 会被判目标源不符整条丢弃。首帧前先挂 load，
  // 等 iframe 真成了 giscus.app 的文档再发；之后每次换主题直发。
  useEffect(() => {
    if (status !== 'ready') return
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    if (!iframe) return

    const post = (theme: string) =>
      iframe.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app')

    if (frameLoaded.current) {
      post(getGiscusTheme(resolvedTheme))
      return
    }
    const onLoad = () => {
      frameLoaded.current = true
      post(getGiscusTheme(themeRef.current))
    }
    iframe.addEventListener('load', onLoad, { once: true })
    return () => iframe.removeEventListener('load', onLoad)
  }, [resolvedTheme, status])

  if (!mounted) {
    return (
      <>
        <h2 className="section-title mb-6">评论</h2>
        <Skeleton />
      </>
    )
  }

  return (
    <div ref={containerRef}>
      <h2 className="section-title mb-6">评论</h2>

      {status === 'loading' && <Skeleton />}

      {status === 'idle' && (
        <div className="text-center py-10" style={{ border: '1px dashed var(--line)' }}>
          <span className="inline-flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
            <IconMessage size={15} strokeWidth={1.7} />
            滚动到此处加载评论区
          </span>
        </div>
      )}

      {status === 'error' && (
        <div
          className="text-center py-8 px-6"
          style={{ border: '1px dashed var(--gold)', background: 'var(--surface)' }}
        >
          <p className="inline-flex items-center justify-center gap-2 font-medium mb-3" style={{ color: 'var(--accent-text)' }}>
            <IconAlertTriangle size={16} strokeWidth={1.7} />
            评论区加载失败
          </p>
          <ul className="text-left text-sm space-y-1.5 max-w-md mx-auto" style={{ color: 'var(--body)' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--accent-text)' }} className="mt-0.5 font-mono">1.</span>
              <span>仓库已启用 <b>Discussions</b>（Settings → Features → 勾选 Discussions）</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--accent-text)' }} className="mt-0.5 font-mono">2.</span>
              <span>
                已安装{' '}
                <a href="https://github.com/apps/giscus" target="_blank" rel="noopener noreferrer" className="underline tint-body hover:text-[var(--accent-text)]">
                  giscus App
                </a>{' '}
                并授权 <code className="text-xs px-1 font-mono" style={{ background: 'var(--surface-2)' }}>LuVisage/blog</code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--accent-text)' }} className="mt-0.5 font-mono">3.</span>
              <span>仓库为 <b>Public</b>（私有仓库不支持 Giscus）</span>
            </li>
          </ul>
          <button
            onClick={() => {
              setStatus('idle')
              const container = document.getElementById('giscus-container')
              if (container) container.innerHTML = ''
            }}
            className="mt-4 text-xs underline transition-colors hover:text-[var(--accent-text)] tint-body"
          >
            点击重试
          </button>
        </div>
      )}

      <div id="giscus-container" className={status === 'ready' ? '' : 'hidden'} />
    </div>
  )
}
