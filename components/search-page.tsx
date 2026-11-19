'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { IconSearch, IconCommand, IconX } from '@tabler/icons-react'
import { PageMasthead } from '@/components/page-masthead'
import { BASE_PATH, basePathUrl } from '@/lib/constants'

/** 只声明本页用到的 pagefind 字段，其余交给它自己负责。 */
type Pagefind = {
  search(term: string): Promise<{
    results?: { data(): Promise<{ url: string; meta?: { title?: string } }> }[]
  } | null>
}

declare global {
  interface Window {
    __pagefind?: Pagefind
  }
}

type Kind = '文章' | '教程' | '分类' | '标签' | '系列' | '栏目'
const FILTERS = ['全部', '文章', '教程', '分类', '标签', '系列', '栏目'] as const
type Filter = typeof FILTERS[number]

/** 一次最多铺开多少条；再多走「显示更多」，避免几十条结果把页面拉到无限长。 */
const RESULT_PAGE = 30

interface SearchResult {
  title: string
  url: string
  kind: Kind
}

/** 服务端算好的真实体量，客户端不猜数字。 */
export interface Start {
  href: string
  name: string
  count: number
  unit: string
}

/** 空态下的真实最近发布，服务端切片传入。 */
export interface Recent {
  href: string
  title: string
  date: string
  minutes: number
}

/** pagefind 报的 URL 自带部署前缀（/blog/posts/x/），先摘掉再喂给 next/link，
    否则它会再加一次 basePath，变成 /blog/blog/。 */
function routePath(url: string): string {
  return BASE_PATH && url.startsWith(BASE_PATH + '/') ? url.slice(BASE_PATH.length) : url
}

/** 分类/标签/系列/栏目页也是内容，不该被丢掉；分页路由只是列表切片，不算独立结果。 */
function resultKind(url: string): Kind | null {
  const path = routePath(url)
  if (/^\/posts\/page\/\d+\/$/.test(path)) return null
  if (/^\/posts\/[^/]+\/$/.test(path)) return '文章'
  if (/^\/learn\/[^/]+\/[^/]+\/$/.test(path)) return '教程'
  if (/^\/categories\/[^/]+\/$/.test(path)) return '分类'
  if (/^\/tags\/[^/]+\/$/.test(path)) return '标签'
  if (/^\/series\/[^/]+\/$/.test(path)) return '系列'
  if (/^\/(posts|learn|categories|tags|series|archive|projects|friends|about|search)\/$/.test(path)) return '栏目'
  return null
}

/** 关键词高亮按片段拼 React 节点，不碰 innerHTML，用户输入天然被转义。 */
function Highlight({ text, term }: { text: string; term: string }) {
  const needle = term.trim().toLowerCase()
  if (!needle) return <>{text}</>
  const lower = text.toLowerCase()
  const parts: ReactNode[] = []
  let cursor = 0
  for (;;) {
    const at = lower.indexOf(needle, cursor)
    if (at === -1) {
      parts.push(text.slice(cursor))
      break
    }
    if (at > cursor) parts.push(text.slice(cursor, at))
    parts.push(<mark key={at} className="apple-mark">{text.slice(at, at + needle.length)}</mark>)
    cursor = at + needle.length
  }
  return <>{parts}</>
}

function EmptyBlock({ children }: { children: ReactNode }) {
  return <div className="pt-14 pb-6 text-center rule">{children}</div>
}

export function SearchPage({ starts, recent }: { starts: Start[]; recent: Recent[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('全部')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(RESULT_PAGE)
  const [isMac, setIsMac] = useState(false)
  const pagefindRef = useRef<Pagefind | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])

  // 不用 autoFocus：它在 hydration commit 才开火，而搜索子树等 pagefind、比刊头晚
  // commit——抽屉先开的话焦点会被拽到遮罩背后。只在焦点还无人使用时接过来。
  useEffect(() => {
    const a = document.activeElement
    if (!a || a === document.body || a === document.documentElement) inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = basePathUrl('/pagefind/pagefind-ui.css')
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.type = 'module'
    // 内联模块的字符串必须闭合：少一个收尾引号就是「Invalid or unexpected token」，
    // window.__pagefind 永远不出现，检索框看着活着、打字永远零结果。
    script.textContent = `
      import * as pf from '${window.location.origin}${basePathUrl('/pagefind/pagefind.js')}';
      window.__pagefind = pf;
    `
    document.head.appendChild(script)

    let tries = 0
    const interval = setInterval(() => {
      tries += 1
      if (window.__pagefind) {
        pagefindRef.current = window.__pagefind
        setReady(true)
        clearInterval(interval)
      } else if (tries >= 100) {
        // 10 秒还没等到就是加载失败，别让 100ms 的轮询空转一生。
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim() || !pagefindRef.current) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)
    setVisible(RESULT_PAGE)

    try {
      const search = await pagefindRef.current.search(term.trim())
      const seen = new Set<string>()
      const unique: SearchResult[] = []

      for (const r of search?.results ?? []) {
        const data = await r.data()
        const kind = resultKind(data.url)
        if (!kind || seen.has(data.url)) continue
        seen.add(data.url)
        unique.push({ title: data.meta?.title || data.url, url: data.url, kind })
      }

      setResults(unique)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, doSearch])

  const shown = filter === '全部' ? results : results.filter((r) => r.kind === filter)
  const displayed = shown.slice(0, visible)

  return (
    <div data-pagefind-ignore>
      <PageMasthead
        eyebrow="搜索 — Search"
        title="搜索"
        lead="输入关键词，在文章、教程与各个栏目里找相关内容。"
        counter={isMac ? '⌘K 随时可用' : 'Ctrl K 随时可用'}
      />

      {/* 关掉 JS 时这是一具死控件：能打进去但 pagefind 跑不了 ——
          整行摘掉，由下面的 noscript 说明接班。 */}
      <div className="field-rule relative flex items-center gap-4 pb-4" data-js-only>
        <IconSearch size={20} strokeWidth={1.75} style={{ color: 'var(--muted)' }} className="flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章、教程与栏目…"
          aria-label="搜索全站内容"
          className="flex-1 min-w-0 bg-transparent border-0 outline-none font-serif"
          style={{
            fontSize: 'clamp(20px, 4vw, 28px)',
            lineHeight: 1.3,
            color: 'var(--ink)',
            letterSpacing: '-0.015em',
          }}
        />
        {loading ? (
          <span className="meta flex-shrink-0">检索中</span>
        ) : query ? (
          <button
            onClick={() => setQuery('')}
            className="btn-ghost h-8 px-2 text-xs flex-shrink-0"
            aria-label="清空搜索"
          >
            <IconX size={13} strokeWidth={2} />
            清除
          </button>
        ) : (
          <kbd
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono flex-shrink-0"
            style={{ border: '1px solid var(--line)', color: 'var(--muted)', borderRadius: 'var(--radius-xs)' }}
          >
            {isMac ? <><IconCommand size={11} strokeWidth={2} />K</> : 'Ctrl K'}
          </kbd>
        )}
      </div>

      {/* 用 dangerouslySetInnerHTML 而不是给 noscript 挂 JSX 子节点：开着 JS 时浏览器把
          noscript 的内容当文本节点，React 拿子节点去水合就判不匹配。 */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            '<p class="body-md py-4" style="color:var(--muted)">检索要在浏览器里跑，关掉 JavaScript 就没有结果。下面的栏目都是静态页，照常能进。</p>',
        }}
      />

      {/* 结果条数是状态消息：容器常驻 DOM，读屏才会在文案换掉时播报。 */}
      <p className="sr-only" role="status" aria-live="polite">
        {loading ? '正在检索' : searched ? (shown.length ? `共 ${shown.length} 条结果` : '没有匹配的内容') : ''}
      </p>

      {!query && !loading && (
        <nav className="pt-14" aria-label="检索之外的入口">
          <div className="flex items-baseline justify-between gap-4 pb-4">
            <span className="eyebrow">还没想好搜什么</span>
            <span className="meta">全站正文与栏目页都可检索</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {starts.map((start) => (
              <Link key={start.href} href={start.href} className="capsule transition-colors">
                {start.name}
                <span className="meta tabular-nums">
                  {start.count} {start.unit}
                </span>
              </Link>
            ))}
          </div>
          {recent.length > 0 && (
            <div className="mt-12">
              <div
                className="flex items-baseline justify-between gap-4 pb-4"
                style={{ borderTop: '2px solid var(--rule)', paddingTop: 'var(--space-12)' }}
              >
                <span className="eyebrow">最近发布</span>
                <Link href="/posts" className="meta tint-body transition-colors hover:text-[var(--accent-text)]">
                  全部文章 →
                </Link>
              </div>
              <ul>
                {recent.map((r, i) => (
                  <li
                    key={r.href}
                    className="flex items-baseline gap-6 py-4"
                    style={{ borderTop: '1px solid var(--line)' }}
                  >
                    <span className="meta tabular-nums shrink-0 hidden sm:inline" style={{ color: 'var(--faint)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="meta tabular-nums shrink-0">{r.date}</span>
                    <Link
                      href={r.href}
                      className="min-w-0 line-clamp-2 text-[17px] leading-snug tint-body transition-colors hover:text-[var(--accent-text)]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {r.title}
                    </Link>
                    <span className="meta ml-auto shrink-0 hidden sm:inline" style={{ color: 'var(--faint)' }}>
                      {r.minutes} 分钟
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      )}

      {loading && results.length === 0 && (
        <div className="pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="py-5 rule">
              <span className="skeleton-line" style={{ width: `${68 - i * 12}%`, height: 16 }} />
            </div>
          ))}
          <div className="rule" />
        </div>
      )}

      {/* 索引没到位时不要静默：静默看起来像「搜不到」，其实是「没在搜」。 */}
      {!loading && query && !ready && (
        <EmptyBlock>
          <p className="body-lg">索引还没就绪。</p>
          <p className="body-sm mt-2">稍等片刻再搜一次。</p>
        </EmptyBlock>
      )}

      {!loading && searched && results.length === 0 && (
        <EmptyBlock>
          <p className="body-lg">没有匹配「<span style={{ color: 'var(--ink)' }}>{query}</span>」的内容。</p>
          <p className="body-sm mt-2">
            换个关键词试试，或者从
            <Link href="/categories" className="pressable link-underline mx-1">
              分类
            </Link>
            里找。
          </p>
        </EmptyBlock>
      )}

      {!loading && shown.length > 0 && (
        <div className="pt-9">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
            <div className="eyebrow">结果</div>
            <span className="meta">{shown.length} 条</span>
          </div>

          <div className="apple-filters mb-7" role="group" aria-label="按类型筛选结果">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                data-js-only
                className="apple-filter"
                aria-pressed={filter === item}
                onClick={() => { setFilter(item); setVisible(RESULT_PAGE) }}
              >
                {item}
                {item !== '全部' && (
                  <span className="meta ml-1.5">{results.filter((r) => r.kind === item).length}</span>
                )}
              </button>
            ))}
          </div>

          <div>
            {displayed.map((result, i) => (
              <Link
                key={result.url}
                href={routePath(result.url)}
                className="pressable group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 sm:gap-6 py-5 rule"
              >
                <span className="meta tabular-nums transition-colors group-hover:text-[var(--accent-text)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="font-serif font-bold row-title transition-colors group-hover:text-[var(--accent-text)] tint-ink"
                  style={{ fontSize: 18, lineHeight: 1.4, letterSpacing: '-0.01em' }}
                >
                  <Highlight text={result.title} term={query} />
                </span>
                <span className="caption flex-shrink-0">{result.kind}</span>
              </Link>
            ))}
          </div>

          {shown.length > displayed.length && (
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                data-js-only
                className="apple-copy-btn"
                onClick={() => setVisible((v) => v + RESULT_PAGE)}
              >
                再显示 {Math.min(RESULT_PAGE, shown.length - displayed.length)} 条
              </button>
              <span className="meta">已显示 {displayed.length} / {shown.length}</span>
            </div>
          )}
          <div className="rule" />
        </div>
      )}

      {/* 有结果、但当前筛选档下一条都没有 —— 别误报成「整站搜不到」。 */}
      {!loading && searched && results.length > 0 && shown.length === 0 && (
        <EmptyBlock>
          <p className="body-lg">「{filter}」这一档没有匹配。</p>
          <p className="body-sm mt-2">切回「全部」可以看到另外 {results.length} 条结果。</p>
        </EmptyBlock>
      )}
    </div>
  )
}
