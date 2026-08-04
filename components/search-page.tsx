'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { IconSearch, IconFileText, IconCommand } from '@tabler/icons-react'

declare global {
  interface Window {
    __pagefind?: any
  }
}

interface SearchResult {
  title: string
  url: string
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const pagefindRef = useRef<any>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `${basePath}/pagefind/pagefind-ui.css`
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.type = 'module'
    script.textContent = `
      import * as pf from '${window.location.origin}${basePath}/pagefind/pagefind.js';
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
  }, [basePath])

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
        const url = data.url
        if (!url.includes('/posts/') || url.endsWith('/posts/')) continue
        if (!seen.has(url)) {
          seen.add(url)
          unique.push({
            title: data.meta?.title || data.url,
            url: data.url,
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">搜索</span>
        </h1>
        <p className="body-sm flex items-center gap-2">
          <IconSearch size={16} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
          也可以使用
          <kbd className="px-2 py-0.5 rounded-lg glass-liquid text-xs font-mono font-medium" style={{ color: 'var(--color-muted)' }}>
            <IconCommand size={11} strokeWidth={2} className="inline -mt-0.5" />K
          </kbd>
          快捷键打开
        </p>
      </div>

      {/* Search input */}
      <div className="rounded-3xl glass-liquid p-4 sm:p-6 mb-4" style={{ cursor: 'default' }}>
        <div className="relative">
          <IconSearch size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            autoFocus
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl glass-liquid text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            style={{ color: 'var(--color-ink)' }}
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-hairline)', borderTopColor: 'var(--color-primary)' }} />
            </div>
          )}
          {!loading && query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-md glass-liquid"
              style={{ color: 'var(--color-muted)' }}
            >
              清除
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && results.length === 0 && (
        <div className="space-y-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 px-4 py-3">
              <div className="h-4 rounded flex-1" style={{ background: 'var(--color-hairline-soft)' }} />
            </div>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16">
          <IconSearch size={40} strokeWidth={1} style={{ color: 'var(--color-muted-soft)' }} className="mx-auto mb-4 opacity-60" />
          <p className="body-md">
            未找到关于 <span className="font-semibold px-1.5 py-0.5 rounded-md" style={{ color: 'var(--color-ink)', background: 'var(--color-primary-soft)' }}>{query}</span> 的相关内容
          </p>
          <p className="caption mt-2">试试其他关键词</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="caption mb-3 mt-6">
            找到 {results.length} 篇相关文章
          </p>
          <ul className="space-y-1">
            {results.map((result) => (
              <li key={result.url}>
                <a
                  href={result.url}
                  className="flex items-center gap-3 px-4 py-3 -mx-1 rounded-xl hover:bg-[var(--color-primary-soft)] transition-all duration-200 group"
                >
                  <IconFileText size={16} strokeWidth={1.5} style={{ color: 'var(--color-muted)' }} />
                  <span className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--color-body)' }}>
                    {result.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
