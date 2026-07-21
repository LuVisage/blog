'use client'

import { useEffect, useState } from 'react'
import { IconFlameFilled } from '@tabler/icons-react'

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

/** Build API URL — always fetches repos pushed in last 7 days, sorted by stars */
function buildApiUrl(): string {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  const dateStr = d.toISOString().split('T')[0] // YYYY-MM-DD
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

/** e.g. "2h ago", "30m ago" from last fetch */
function formatTimeAgo(ms: number): string {
  const minutes = Math.floor((Date.now() - ms) / 60_000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  return `${Math.floor(hours / 24)} 天前`
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
  // Track which day the cache is from
  const cacheDate = lastFetch ? new Date(lastFetch).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : null

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      // 1. Try cache first
      const cached = getCached()
      if (cached) {
        if (!cancelled) {
          setRepos(cached.data)
          setLastFetch(cached.fetchedAt)
          setLoading(false)
        }
        return
      }

      // 2. Fetch from GitHub API (dynamic URL with 7-day window)
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
      <div className="rounded-2xl glass-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-5 w-24 rounded animate-pulse" style={{ background: 'var(--color-hairline-soft)' }} />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-5 w-7 rounded flex-shrink-0 animate-pulse" style={{ background: 'var(--color-hairline-soft)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded animate-pulse" style={{ background: 'var(--color-hairline-soft)' }} />
                <div className="h-3 w-full max-w-sm rounded animate-pulse" style={{ background: 'var(--color-hairline-soft)' }} />
              </div>
              <div className="h-4 w-12 rounded flex-shrink-0 animate-pulse" style={{ background: 'var(--color-hairline-soft)' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Error / no data — silent fallback ────────────
  if (!repos || repos.length === 0) return null

  // ── Ready ────────────────────────────────────────
  return (
    <div className="rounded-2xl glass-card p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 lg:mb-5">
          <h2 className="text-base lg:text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-ink)' }}>
            <IconFlameFilled size={20} className="text-orange-400" />
            AI 热榜
            <span className="text-xs font-normal px-2 py-0.5 rounded-full glass" style={{ color: 'var(--color-muted)' }}>
              近 7 日热门
            </span>
          </h2>
          {lastFetch && (
            <span className="text-xs" style={{ color: 'var(--color-muted-soft)' }}>
              {cacheDate} 更新
            </span>
          )}
        </div>

        {/* Repo list */}
        <div className="space-y-2">
          {repos.map((repo, i) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 px-3 py-3 -mx-3 rounded-xl transition-all duration-200 group hover:bg-[var(--color-primary-soft)]"
            >
              {/* Rank */}
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  color: i < 3 ? '#fff' : 'var(--color-muted)',
                  background: i === 0
                    ? 'linear-gradient(135deg, #f59e0b, #f97316)'
                    : i === 1
                      ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                      : i === 2
                        ? 'linear-gradient(135deg, #d97706, #b45309)'
                        : 'var(--color-hairline-soft)',
                }}
              >
                {i + 1}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium transition-colors truncate group-hover:text-[var(--color-primary)]" style={{ color: 'var(--color-ink)' }}>
                    {repo.full_name}
                  </p>
                  {repo.language && (
                    <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full" style={{ color: 'var(--color-muted)', background: 'var(--color-hairline-soft)' }}>
                      {repo.language}
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--color-body)' }}>
                    {repo.description}
                  </p>
                )}
                {/* Topics */}
                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {repo.topics.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded-full glass" style={{ color: 'var(--color-body)' }}
                      >
                        {t}
                      </span>
                    ))}
                    {repo.topics.length > 3 && (
                      <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                        +{repo.topics.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Stars */}
              <span className="flex-shrink-0 flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-amber-400"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {formatStars(repo.stargazers_count)}
              </span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <a
            href="https://github.com/topics/artificial-intelligence"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors hover:text-[var(--color-primary)]"
            style={{ color: 'var(--color-muted)' }}
          >
            在 GitHub 上查看更多 AI 项目 →
          </a>
        </div>
      </div>
  )
}
