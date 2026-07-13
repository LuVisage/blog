'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

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
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          也可以使用{' '}
          <kbd className="px-1.5 py-0.5 rounded-lg bg-pink-50 dark:bg-purple-950/50 border border-pink-100 dark:border-purple-500/20 text-xs font-mono text-gray-400 dark:text-gray-500">
            ⌘K
          </kbd>{' '}
          快捷键打开
        </p>
      </div>

      {/* Search input */}
      <div className="rounded-3xl glass p-4 sm:p-6">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 dark:bg-purple-950/40 border border-pink-100/60 dark:border-purple-500/20 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 focus:border-transparent transition-all text-sm"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
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
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                未找到关于 <span className="text-pink-500 font-medium">{query}</span> 的相关内容
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="space-y-1">
              {results.map((result) => (
                <li key={result.url}>
                  <a
                    href={result.url}
                    className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-xl hover:bg-pink-50/60 dark:hover:bg-purple-900/30 transition-colors group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 text-pink-400"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors truncate">
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
