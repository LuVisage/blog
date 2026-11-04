'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { IconSearch, IconCommand, IconX } from '@tabler/icons-react'
import { PageMasthead } from '@/components/page-masthead'
import { BASE_PATH, basePathUrl } from '@/lib/constants'

/** 本页只碰到 pagefind 的这几个字段，其余交给它自己负责。 */
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

interface SearchResult {
  title: string
  url: string
  kind: '文章' | '教程'
}

/** 服务端算好的真实体量，客户端不猜数字。 */
export interface Start {
  href: string
  name: string
  count: number
  unit: string
}

/** Trailing slashes everywhere, so match the slug segments rather than the prefix. */
function resultKind(url: string): SearchResult['kind'] | null {
  if (/\/posts\/[^/]+\/$/.test(url)) return '文章'
  if (/\/learn\/[^/]+\/[^/]+\/$/.test(url)) return '教程'
  return null
}

/** pagefind 报的 URL 自带部署前缀（/blog/posts/x/），而 next/link 会再加一次
    basePath —— 原样喂进去就变成 /blog/blog/。Link 要的是路由路径，先摘前缀。 */
function routePath(url: string): string {
  return BASE_PATH && url.startsWith(BASE_PATH + '/') ? url.slice(BASE_PATH.length) : url
}

export function SearchPage({ starts }: { starts: Start[] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [ready, setReady] = useState(false)
  const pagefindRef = useRef<Pagefind | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = basePathUrl('/pagefind/pagefind-ui.css')
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.type = 'module'
    // 字符串必须闭合：少一个收尾引号，整段内联模块就是「Invalid or unexpected
    // token」，window.__pagefind 永远不出现，检索框看着活着、打字永远零结果。
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
        // 10 秒还没等到就是加载失败，别再用 100ms 的轮询空转一生。
        clearInterval(interval)
      }
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim() || !pagefindRef.current) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const search = await pagefindRef.current.search(term.trim())
      if (!search?.results?.length) {
        setResults([])
        setLoading(false)
        return
      }

      const seen = new Set<string>()
      const unique: SearchResult[] = []

      for (const r of search.results) {
        const data = await r.data()
        const url: string = data.url
        const kind = resultKind(url)
        if (!kind) continue
        if (!seen.has(url)) {
          seen.add(url)
          unique.push({
            title: data.meta?.title || url,
            url,
            kind,
          })
        }
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

    debounceRef.current = setTimeout(() => {
      doSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, doSearch])

  return (
    <div data-pagefind-ignore>
      <PageMasthead
        eyebrow="搜索 — Search"
        title="搜索"
        lead="输入关键词，在全部文章和教程里找相关内容。"
        counter="⌘K 随时可用"
      />

      {/* Query field — a ruled line, not a pill；聚焦时线色转强调色。
          关掉 JS 时这是一具死控件：能打进去，但 pagefind 跑不了，永远没有结果 ——
          整行摘掉，由下面那条 noscript 说明来接班（同 §11.22 的 data-js-only 约定）。 */}
      <div className="field-rule relative flex items-center gap-4 pb-4" data-js-only>
        <IconSearch size={20} strokeWidth={1.75} style={{ color: 'var(--muted)' }} className="flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章与教程…"
          autoFocus
          aria-label="搜索文章与教程"
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
            <IconCommand size={11} strokeWidth={2} />K
          </kbd>
        )}
      </div>

      {/* 检索跑在浏览器里（pagefind 的索引是静态分块），没有 JS 就没有结果 ——
          上面那行输入框已经摘掉了，这里补一句为什么，并把人递到下面的栏目入口。
          用 dangerouslySetInnerHTML 而不是给 noscript 挂 JSX 子节点：开着 JS 时浏览器把
          noscript 的内容当文本节点，React 拿子节点去水合就判不匹配（§11.21 五 同一课）。 */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            '<p class="body-md py-4" style="color:var(--muted)">检索要在浏览器里跑，关掉 JavaScript 就没有结果。下面的栏目都是静态页，照常能进。</p>',
        }}
      />

      {/* 结果条数是状态消息：容器得常驻 DOM，读屏才会在文案换掉时播报。
          把可见的「结果 / N 条」标题挂 aria-live 没用 —— 它和数据是同一次挂载才出现的。 */}
      <p className="sr-only" role="status" aria-live="polite">
        {loading ? '正在检索' : searched ? (results.length ? `共 ${results.length} 条结果` : '没有匹配的内容') : ''}
      </p>

      {/* Results */}
      {!query && !loading && (
        <nav className="pt-14" aria-label="检索之外的入口">
          <div className="flex items-baseline justify-between gap-4 pb-4">
            <span className="eyebrow">还没想好搜什么</span>
            <span className="meta">这里只检索文章与教程的正文</span>
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
        <div className="pt-14 pb-6 text-center rule">
          <p className="body-lg">索引还没就绪。</p>
          <p className="body-sm mt-2">稍等片刻再搜一次。</p>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="pt-14 pb-6 text-center rule">
          <p className="body-lg">没有匹配「<span style={{ color: 'var(--ink)' }}>{query}</span>」的内容。</p>
          <p className="body-sm mt-2">
            换个关键词试试，或者从
            <Link href="/categories" className="pressable link-underline mx-1">
              分类
            </Link>
            里找。
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="pt-9">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <div className="eyebrow">结果</div>
            <span className="meta">{results.length} 条</span>
          </div>
          <div className="stagger">
            {/* 原先这里是裸 <a>：搜到就整页重载，转场动画、焦点交接、预取一个都不参与，
                慢半拍还把滚动位置甩回顶部。Link 渲染的仍是 <a>，样式与聚光行照旧。 */}
            {results.map((result, i) => (
              <Link
                key={result.url}
                href={routePath(result.url)}
                data-spotlight="row"
                className="pressable group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 sm:gap-6 py-5 rule"
              >
                <span className="meta tabular-nums transition-colors group-hover:text-[var(--accent-text)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="font-serif font-bold row-title transition-colors group-hover:text-[var(--accent-text)] tint-ink"
                  style={{ fontSize: 18, lineHeight: 1.4, letterSpacing: '-0.01em' }}
                >
                  {result.title}
                </span>
                <span className="caption flex-shrink-0">{result.kind}</span>
              </Link>
            ))}
          </div>
          <div className="rule" />
        </div>
      )}
    </div>
  )
}
