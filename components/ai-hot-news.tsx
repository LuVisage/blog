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
  const [failed, setFailed] = useState(false)
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
          setFailed(true)
        }
      }

      if (!cancelled) setLoading(false)
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [])

  const rows = repos ?? []
  const empty = !loading && !failed && rows.length === 0
  const stateWord = loading ? '加载中' : failed ? '没应答' : empty ? '没有命中' : `${cacheDate} 更新`
  // 骨架 → 列表 → 失败都是页面加载完才发生的替换，容器必须常驻才播得出来（§11.20 的挂法）。
  const spoken = loading
    ? 'AI 热榜正在向 GitHub 取数据。'
    : failed
      ? 'AI 热榜这次没取到，GitHub 没有应答。'
      : empty
        ? 'AI 热榜近 7 日没有命中的项目。'
        : `AI 热榜取到 ${rows.length} 条，${stateWord}。`

  return (
    <div style={{ cursor: 'default' }}>
      {/* Header —— 三种状态都留着，标题不随数据消失 */}
      <div
        className="flex items-end justify-between gap-3 pb-3 mb-1"
        style={{ borderBottom: '1px solid var(--line-strong)' }}
      >
        <h2 className="section-title">AI 热榜</h2>
        <span className="eyebrow mb-1">{stateWord}</span>
      </div>

      {/* Loading skeleton */}
      {loading && (
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
      )}

      {/* 拉取失败 / 空榜：留一句能读的原因，别把整块抹掉留个空标题 */}
      {!loading && (failed || empty) && (
        <p className="body-sm py-5" style={{ color: 'var(--muted)' }}>
          {failed
            ? '热榜要现场问 GitHub，这次没得到应答。稍后再进首页会自动再试。'
            : '近 7 日没有同时命中这两个主题的项目。'}
        </p>
      )}

      {/* Repo list */}
      {!loading &&
        !failed &&
        rows.map((repo, i) => (
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
              style={i < 3 ? { color: 'var(--accent-text)' } : undefined}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Content */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-sm font-medium truncate transition-colors group-hover:text-[var(--accent-text)] tint-ink">
                  {repo.full_name}
                </p>
                {repo.language && (
                  <span className="chip px-2 py-1 text-[11px] flex-shrink-0" style={{ color: 'var(--muted)' }}>
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
                      className="text-[11px] px-2 py-1 font-mono"
                      style={{ color: 'var(--faint)', border: '1px solid var(--line-faint)', borderRadius: 'var(--radius-xs)' }}
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

      <p className="sr-only" role="status" aria-live="polite">{spoken}</p>

      {/* Footer */}
      <div className="mt-1 pt-4 text-center" style={{ borderTop: '1px solid var(--line)' }}>
        <a
          href="https://github.com/topics/artificial-intelligence"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-6 items-center text-xs font-medium transition-colors hover:text-[var(--accent-text)] tint-muted"
        >
          在 GitHub 上查看更多 AI 项目 →
        </a>
      </div>
    </div>
  )
}
