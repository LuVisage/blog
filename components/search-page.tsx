'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { IconSearch, IconCommand, IconX } from '@tabler/icons-react'
import { PageMasthead } from '@/components/page-masthead'
import { basePathUrl } from '@/lib/constants'

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

/** Trailing slashes everywhere, so match the slug segments rather than the prefix. */
function resultKind(url: string): SearchResult['kind'] | null {
  if (/\/posts\/[^/]+\/$/.test(url)) return '文章'
  if (/\/learn\/[^/]+\/[^/]+\/$/.test(url)) return '教程'
  return null
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const pagefindRef = useRef<Pagefind | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = basePathUrl('/pagefind/pagefind-ui.css')
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.type = 'module'
    script.textContent = `
      import * as pf from '${window.location.origin}${basePathUrl('/pagefind/pagefind.js')};
      window.__pagefind = pf;
    `
    document.head.appendChild(script)

    const interval = setInterval(() => {
      if (window.__pagefind) {
        pagefindRef.current = window.__pagefind
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

      {/* Query field — a ruled line, not a pill */}
      <div className="relative flex items-center gap-4 pb-4" style={{ borderBottom: '2px solid var(--ink)' }}>
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
            style={{ border: '1px solid var(--line)', color: 'var(--muted)', borderRadius: 6 }}
          >
            <IconCommand size={11} strokeWidth={2} />K
          </kbd>
        )}
      </div>

      {/* Results */}
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

      {!loading && searched && results.length === 0 && (
        <div className="pt-14 pb-6 text-center rule">
          <p className="body-lg">没有匹配「<span style={{ color: 'var(--ink)' }}>{query}</span>」的内容。</p>
          <p className="body-sm mt-2">换个关键词试试，或者从分类里找。</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="pt-9">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <div className="eyebrow">结果</div>
            <span className="meta">{results.length} 条</span>
          </div>
          <div>
            {results.map((result, i) => (
              <a
                key={result.url}
                href={result.url}
                data-spotlight="row"
                className="group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 sm:gap-6 py-5 rule"
              >
                <span className="meta tabular-nums transition-colors group-hover:text-[var(--accent-text)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="font-serif font-bold truncate transition-colors group-hover:text-[var(--accent-text)]"
                  style={{ fontSize: 18, lineHeight: 1.4, color: 'var(--ink)', letterSpacing: '-0.01em' }}
                >
                  {result.title}
                </span>
                <span className="caption flex-shrink-0">{result.kind}</span>
              </a>
            ))}
          </div>
          <div className="rule" />
        </div>
      )}
    </div>
  )
}
