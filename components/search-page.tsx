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

  // Load Pagefind once on mount via module script (bypasses webpack)
  useEffect(() => {
    // Load CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `${basePath}/pagefind/pagefind-ui.css`
    document.head.appendChild(link)

    // Load JS via <script type="module"> — webpack can't intercept dynamic browser imports
    const script = document.createElement('script')
    script.type = 'module'
    script.textContent = `
      import * as pf from '${window.location.origin}${basePath}/pagefind/pagefind.js';
      window.__pagefind = pf;
    `
    document.head.appendChild(script)

    // Poll until pagefind is ready (module scripts load async)
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

      // Fetch all result data, deduplicate by URL, only keep articles
      const seen = new Set<string>()
      const unique: SearchResult[] = []

      for (const r of search.results) {
        const data = await r.data()
        const url = data.url
        // Only show actual blog posts (not tag pages, listing pages, homepage)
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

  // Debounced search on query change
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
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">搜索</span>
        </h1>
        <p className="body-sm flex items-center gap-1.5">
          也可以使用
          <kbd className="px-1.5 py-0.5 rounded-lg glass text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
            <IconCommand size={11} strokeWidth={2} className="inline" />K
          </kbd>
          快捷键打开
        </p>
      </div>

      {/* Search input */}
      <div className="rounded-3xl glass-card p-4 sm:p-6">
        <div className="relative">
          <IconSearch size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            style={{ color: 'var(--color-ink)' }}
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-4">
          {loading && results.length === 0 && (
            <div className="space-y-3 px-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                </div>
              ))}
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-8">
              <IconSearch size={36} strokeWidth={1} style={{ color: 'var(--color-muted-soft)' }} className="mx-auto mb-3" />
              <p className="body-sm">
                未找到关于 <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{query}</span> 的相关内容
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="space-y-1">
              {results.map((result) => (
                <li key={result.url}>
                  <a
                    href={result.url}
                    className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <IconFileText size={16} strokeWidth={1.5} style={{ color: 'var(--color-muted)' }} />
                    <span className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--color-body)' }}>
                      {result.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
