/**
 * Bring-your-own-key forwarder for the /learn/agent playgrounds.
 *
 * The visitor's key arrives in the Authorization header, is copied straight to the
 * provider and nothing else. This file never stores, logs, caches or echoes it:
 * there is no KV, no D1, no console call and no analytics here, and the key is
 * never read from a query string or a cookie.
 *
 * What it does police, because the calls spend the visitor's own money:
 *   - only three known paths, so this is not a general-purpose proxy
 *   - only provider bases on the allow-list, so it is not an SSRF hop
 *   - per-IP request budget and a hard max_tokens clamp
 */

const ROUTES = new Set(['/v1/chat/completions', '/v1/embeddings', '/v1/models'])

const DEFAULT_UPSTREAMS = [
  'https://api.openai.com/v1',
  'https://api.deepseek.com/v1',
  'https://dashscope.aliyuncs.com/compatible-mode/v1',
  'https://open.bigmodel.cn/api/paas/v4',
  'https://api.moonshot.cn/v1',
  'https://api.siliconflow.cn/v1',
]

const list = (value, fallback) =>
  (value || '')
    .split(',')
    .map((item) => item.trim().replace(/\/+$/, ''))
    .filter(Boolean)
    .concat(value ? [] : fallback)

/** Best-effort, per-isolate. Enough to stop a stray script; not a WAF. */
const buckets = new Map()

function spend(ip, cap, perDay) {
  const day = new Date().toISOString().slice(0, 10)
  const now = Date.now()
  const entry = buckets.get(ip)
  if (!entry || entry.day !== day) {
    if (buckets.size > 2e4) buckets.clear()
    buckets.set(ip, { day, requests: 1, window: [now] })
    return { ok: true }
  }
  entry.requests += 1
  entry.window = entry.window.filter((at) => now - at < 6e4)
  entry.window.push(now)
  if (entry.window.length > cap) return { ok: false, retry: 60 }
  if (perDay && entry.requests > perDay) return { ok: false, retry: 3600 }
  return { ok: true }
}

function cors(origin, allowed) {
  if (!origin || !allowed.includes(origin.toLowerCase())) return null
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type, x-upstream-base',
    'access-control-max-age': '600',
    vary: 'Origin',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
  }
}

function reject(headers, status, message, retry) {
  return new Response(
    JSON.stringify({ error: { message } }),
    {
      status,
      headers: { ...headers, 'content-type': 'application/json; charset=utf-8', ...(retry ? { 'retry-after': String(retry) } : {}) },
    }
  )
}

/** Cloudflare 只在 `cf.clientIp` 上给真实 IP；回退的头由访客可控，只在本地测试时用。 */
function clientIp(request) {
  return request.cf?.clientIp || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}

/** Normalised `https://host/prefix` — compared whole, so no path tricks slip past. */
function upstreamOf(value, allowed) {
  const raw = (value || '').trim().replace(/\/+$/, '')
  if (!allowed.includes(raw)) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    return url
  } catch {
    return null
  }
}

/** Cap the fields that decide what a single call can cost. */
function clamp(body, path, maxTokens, embedBatch) {
  const next = { ...body }
  if (path === '/v1/chat/completions') {
    if (typeof next.max_tokens !== 'number' || next.max_tokens > maxTokens || next.max_tokens < 1) {
      next.max_tokens = maxTokens
    }
  }
  if (Array.isArray(next.input) && next.input.length > embedBatch) {
    throw new RangeError(`一次最多向 ${embedBatch} 段文本做向量，这里给了 ${next.input.length} 段`)
  }
  return next
}

const worker = {
  async fetch(request, env = {}) {
    const allowedOrigins = list(env.ALLOWED_ORIGINS, ['https://luvisage.github.io']).map((o) => o.toLowerCase())
    const headers = cors(request.headers.get('origin') || '', allowedOrigins)
    if (!headers) return new Response('origin not allowed', { status: 403, headers: { 'content-type': 'text/plain; charset=utf-8' } })
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })

    const path = new URL(request.url).pathname.replace(/\/+$/, '')
    if (!ROUTES.has(path)) return reject(headers, 404, '这个代理只转发 /v1/chat/completions、/v1/embeddings 和 /v1/models。')
    // 白名单里的 base 自带各家的版本段（openai 是 /v1、智谱是 /v4），所以只能拼掉本地版本段的后缀。
    const resource = path.replace(/^\/v1(?=\/)/, '')

    const auth = request.headers.get('authorization') || ''
    if (!/^Bearer\s+\S/i.test(auth)) return reject(headers, 401, '缺少 API Key。Key 存在你自己的浏览器里，由你填入。')

    const base = upstreamOf(request.headers.get('x-upstream-base'), list(env.UPSTREAM_ALLOWLIST, DEFAULT_UPSTREAMS))
    if (!base) return reject(headers, 403, '这个上游地址不在允许列表里。')

    const gate = spend(clientIp(request), Number(env.REQUESTS_PER_MINUTE) || 10, Number(env.REQUESTS_PER_DAY) || 200)
    if (!gate.ok) {
      return reject(headers, 429, `这个 IP 的请求太频繁了，请 ${gate.retry} 秒后再试。`, gate.retry)
    }

    const maxTokens = Math.min(Number(env.MAX_TOKENS) || 1024, 4096)
    const embedBatch = Number(env.EMBED_BATCH) || 32
    let payload = null

    if (request.method === 'POST') {
      const raw = await request.text()
      if (new TextEncoder().encode(raw).length > (Number(env.MAX_BODY_BYTES) || 65536)) {
        return reject(headers, 413, '请求体太大，短一些再试。')
      }
      try {
        payload = clamp(JSON.parse(raw), path, maxTokens, embedBatch)
      } catch (error) {
        if (error instanceof RangeError) return reject(headers, 400, error.message)
        return reject(headers, 400, '请求体不是合法 JSON。')
      }
    } else if (request.method !== 'GET') {
      return reject(headers, 405, '只接受 GET 和 POST。')
    }

    let upstream
    try {
      upstream = await fetch(`${base.href.replace(/\/+$/, '')}${resource}${new URL(request.url).search}`, {
        method: request.method,
        redirect: 'manual',
        headers: {
          authorization: auth,
          ...(payload ? { 'content-type': 'application/json' } : {}),
        },
        ...(payload ? { body: JSON.stringify(payload) } : {}),
      })
    } catch {
      return reject(headers, 502, '上游没有响应。换个小一点的模型，或稍后再试。')
    }

    /* The body is forwarded as-is, which is what keeps the token stream streaming. */
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...headers,
        'content-type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
      },
    })
  },
}

export default worker
