'use client'

import { useEffect, useState } from 'react'
import { IconStarFilled } from '@tabler/icons-react'

// ── Types ──────────────────────────────────────────────

interface Repo {
  id: number
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  language: string | null
  topics: string[]
}

interface CachedData {
  data: Repo[]
  fetchedAt: number
}

// ── Constants ──────────────────────────────────────────

const CACHE_KEY = 'ai-hot-news'
const CACHE_TTL = 60 * 60 * 1000 // 60 minutes

function buildApiUrl(): string {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  const dateStr = d.toISOString().split('T')[0]
  return (
    'https://api.github.com/search/repositories' +
    `?q=topic:artificial-intelligence+topic:machine-learning+pushed:>${dateStr}` +
    '&sort=stars&order=desc&per_page=5'
  )
}

// ── Helpers ────────────────────────────────────────────

function formatStars(n: number): string {
  if (n >= 1000) {
    const k = n / 1000
    return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1)}k`
  }
  return String(n)
}

function getCached(): CachedData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed: CachedData = JSON.parse(raw)
    if (Date.now() - parsed.fetchedAt > CACHE_TTL) return null
    return parsed
  } catch {
    return null
  }
}

function setCache(data: Repo[]) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, fetchedAt: Date.now() } satisfies CachedData)
    )
  } catch {
    // localStorage full or unavailable — ignore
  }
}

// ── Component ──────────────────────────────────────────

export function AIHotNews() {
  const [repos, setRepos] = useState<Repo[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<number | null>(null)
  const cacheDate = lastFetch ? new Date(lastFetch).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : null

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      const cached = getCached()
      if (cached) {
        if (!cancelled) {
          setRepos(cached.data)
          setLastFetch(cached.fetchedAt)
          setLoading(false)
        }
        return
      }

      try {
        const res = await fetch(buildApiUrl(), {
          headers: { Accept: 'application/vnd.github+json' },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) {
          const items = (json.items || []).slice(0, 5) as Repo[]
          setRepos(items)
          setLastFetch(Date.now())
          setCache(items)
        }
      } catch {
        if (!cancelled) {
          setRepos(null)
        }
      }

      if (!cancelled) setLoading(false)
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [])

  // ── Loading skeleton ─────────────────────────────
  if (loading) {
    return (
      <div style={{ cursor: 'default' }}>
        <div className="eyebrow mb-4">加载中</div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-baseline gap-3">
              <span className="skeleton-line" style={{ width: 22, height: 12, flexShrink: 0 }} />
              <span className="flex-1 space-y-2">
                <span className="skeleton-line block" style={{ width: '62%', height: 13 }} />
                <span className="skeleton-line block" style={{ width: '88%', height: 10 }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Error / no data ────────────────────────────
  if (!repos || repos.length === 0) return null

  // ── Ready ──────────────────────────────────────
  return (
    <div style={{ cursor: 'default' }}>
      {/* Header */}
      <div
        className="flex items-end justify-between gap-3 pb-3 mb-1"
        style={{ borderBottom: '1px solid var(--line-strong)' }}
      >
        <h2 className="section-title">AI 热榜</h2>
        <span className="eyebrow mb-1">{lastFetch ? `${cacheDate} 更新` : '近 7 日'}</span>
      </div>

      {/* Repo list */}
      <div>
        {repos.map((repo, i) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            data-spotlight="row"
            className="group grid grid-cols-[26px_minmax(0,1fr)_auto] items-baseline gap-3 py-3.5 rule"
          >
            {/* Rank */}
            <span
              className="meta tabular-nums transition-colors group-hover:text-[var(--accent-text)]"
              style={i < 3 ? { color: 'var(--gold)' } : undefined}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Content */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-medium truncate transition-colors group-hover:text-[var(--accent-text)]" style={{ color: 'var(--ink)' }}>
                  {repo.full_name}
                </p>
                {repo.language && (
                  <span className="chip px-1.5 py-0.5 text-[10px] flex-shrink-0" style={{ color: 'var(--muted)' }}>
                    {repo.language}
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="body-sm line-clamp-2 mt-1">{repo.description}</p>
              )}
              {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {repo.topics.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 font-mono"
                      style={{ color: 'var(--faint)', border: '1px solid var(--line-faint)', borderRadius: 4 }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stars */}
            <span className="meta flex-shrink-0 inline-flex items-center gap-1">
              <IconStarFilled size={10} style={{ color: 'var(--gold)' }} />
              {formatStars(repo.stargazers_count)}
            </span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-1 pt-4 text-center" style={{ borderTop: '1px solid var(--line)' }}>
        <a
          href="https://github.com/topics/artificial-intelligence"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-6 items-center text-xs font-medium transition-colors hover:text-[var(--accent-text)]"
          style={{ color: 'var(--muted)' }}
        >
          在 GitHub 上查看更多 AI 项目 →
        </a>
      </div>
    </div>
  )
}
