'use client'

import { useEffect, useState } from 'react'
import { IconFlame, IconStarFilled } from '@tabler/icons-react'

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
      <div className="rounded-2xl glass-card p-6 sm:p-7" style={{ cursor: 'default' }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="h-5 w-24 rounded animate-pulse" style={{ background: 'var(--color-hairline-soft)' }} />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-5 w-7 rounded flex-shrink-0" style={{ background: 'var(--color-hairline-soft)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 rounded" style={{ background: 'var(--color-hairline-soft)' }} />
                <div className="h-3 w-full max-w-xs rounded" style={{ background: 'var(--color-hairline-soft)' }} />
              </div>
              <div className="h-4 w-10 rounded flex-shrink-0" style={{ background: 'var(--color-hairline-soft)' }} />
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
    <div className="rounded-2xl glass-card p-6 sm:p-7" style={{ cursor: 'default' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base lg:text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-ink)' }}>
          <IconFlame size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />
          AI 热榜
          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full glass" style={{ color: 'var(--color-muted)' }}>
            近 7 日
          </span>
        </h2>
        {lastFetch && (
          <span className="text-[10px]" style={{ color: 'var(--color-muted-soft)' }}>
            {cacheDate} 更新
          </span>
        )}
      </div>

      {/* Repo list */}
      <div className="space-y-1">
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
              className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold"
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
                  <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ color: 'var(--color-muted)', background: 'var(--color-hairline-soft)' }}>
                    {repo.language}
                  </span>
                )}
              </div>
              {repo.description && (
                <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--color-body)' }}>
                  {repo.description}
                </p>
              )}
              {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {repo.topics.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded-full glass font-medium" style={{ color: 'var(--color-body)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stars */}
            <span className="flex-shrink-0 flex items-center gap-1 text-xs mt-0.5 font-mono" style={{ color: 'var(--color-muted)' }}>
              <IconStarFilled size={11} style={{ color: 'var(--color-accent-gold)' }} />
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
          className="text-xs font-medium transition-colors hover:text-[var(--color-primary)]"
          style={{ color: 'var(--color-muted)' }}
        >
          在 GitHub 上查看更多 AI 项目 →
        </a>
      </div>
    </div>
  )
}
