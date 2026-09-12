/**
 * Rule tests for the BYOK forwarder — no network, no wrangler, no key.
 *
 *   node scripts/test-proxy.mjs
 *
 * The provider is a stub in this process, so every assertion is about what the
 * Worker is willing to send and what it is willing to hand back. The first group
 * reads the source text itself: "we never store or log the key" is a promise that
 * a lint-style check can keep honest far better than a comment can.
 */
import { readFileSync } from 'fs'

const worker = await import('../proxy/src/index.js')

const source = readFileSync(new URL('../proxy/src/index.js', import.meta.url), 'utf8')

const ENV = {
  ALLOWED_ORIGINS: 'https://luvisage.github.io,http://localhost:3000',
  UPSTREAM_ALLOWLIST: 'https://api.openai.com/v1',
  MAX_TOKENS: '1024',
  MAX_BODY_BYTES: '2048',
  EMBED_BATCH: '4',
  REQUESTS_PER_MINUTE: '3',
  REQUESTS_PER_DAY: '200',
}

const KEY = 'sk-secret-ABCDEFGH'
const BASE = 'https://api.openai.com/v1'

const failures = []
const check = (name, ok, detail) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : ` — ${detail}`}`)
  if (!ok) failures.push(name)
}

/** Stands in for the provider; records exactly what the Worker put on the wire. */
let sent = []
let behaviour = { status: 200, type: 'application/json', body: JSON.stringify({ choices: [{ message: { content: 'hi' } }], usage: { total_tokens: 7 } }) }
globalThis.fetch = async (url, init) => {
  sent.push({ url: String(url), init })
  if (behaviour === 'boom') throw new TypeError('upstream down')
  return new Response(behaviour.body, { status: behaviour.status, headers: { 'content-type': behaviour.type } })
}

async function call(path, { method = 'POST', origin = 'https://luvisage.github.io', ip = '1.1.1.1', authorization = `Bearer ${KEY}`, upstream = BASE, body, headers = {} } = {}) {
  const request = new Request(`https://proxy.test${path}`, {
    method,
    headers: { origin, 'x-forwarded-for': ip, ...(authorization ? { authorization } : {}), ...(upstream ? { 'x-upstream-base': upstream } : {}), ...headers },
    ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  })
  return worker.default.fetch(request, ENV)
}

/* ---------- 1. the key never lands anywhere it should not ---------- */

const forbidden = [
  ['console.', '不得打印任何东西，日志会带上请求头'],
  ['.put(', '不得写 KV'],
  ['.batch(', '不得批量写 KV'],
  ['insert(', '不得写数据库'],
  ['set-cookie', '不得给浏览器种 cookie'],
  ['setInterval', '不得留后台任务'],
]
for (const [needle, why] of forbidden) {
  check(`源码里不含 ${needle}`, !source.includes(needle), why)
}
check('Key 只从 authorization 头取', /headers\.get\('authorization'\)/.test(source) && !/searchParams/.test(source) && !/document\.cookie/.test(source))
check('转发时没有把 Key 拼进 URL', !source.includes('${auth}') && !source.includes('+ auth'))

/* ---------- 2. who may call, and to where ---------- */

sent = []
let response = await call('/v1/chat/completions', { origin: 'https://evil.example' })
check('陌生来源 403 且不带 CORS 头', response.status === 403 && !response.headers.get('access-control-allow-origin'), String(response.status))

response = await call('/v1/chat/completions', { method: 'OPTIONS', origin: 'http://localhost:3000', authorization: null, upstream: null })
check(
  '预检 204 并允许三个自定义头',
  response.status === 204 && /x-upstream-base/.test(response.headers.get('access-control-allow-headers') || ''),
  response.headers.get('access-control-allow-headers')
)

response = await call('/v1/chat/completions', { authorization: null })
check('没填 Key 时 401 且不打到上游', response.status === 401 && sent.length === 0, `${response.status} / ${sent.length}`)

response = await call('/v1/chat/completions', { upstream: 'https://169.254.169.254/latest' })
check('白名单外的上游 403 且不打到上游', response.status === 403 && sent.length === 0, `${response.status} / ${sent.length}`)

response = await call('/v1/chat/completions', { upstream: 'http://api.openai.com/v1' })
check('拒绝明文 http 上游', response.status === 403, String(response.status))

response = await call('/v1/admin', { upstream: BASE })
check('未知路径 404', response.status === 404, String(response.status))

/* ---------- 3. what goes upstream ---------- */

sent = []
response = await call('/v1/chat/completions', { ip: '2.2.2.1', body: { model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'hey' }], max_tokens: 99999 } })
const chat = sent[0]
check('转发到白名单地址', chat?.url === 'https://api.openai.com/v1/chat/completions', chat?.url)
check('Key 原样放在 authorization 头', chat?.init.headers.authorization === `Bearer ${KEY}`)
check('max_tokens 被压回上限', JSON.parse(chat.init.body).max_tokens === 1024, JSON.parse(chat.init.body).max_tokens)
check('响应带 no-store', response.headers.get('cache-control') === 'no-store', response.headers.get('cache-control'))
const echoed = `${await response.text()} ${[...response.headers].join(' ')}`
check('响应里不出现 Key', !echoed.includes(KEY))

/* 上游自带版本段时，本地的 /v1 前缀不得重复拼上去。 */
ENV.UPSTREAM_ALLOWLIST = 'https://open.bigmodel.cn/api/paas/v4'
sent = []
await call('/v1/chat/completions', { ip: '2.2.2.9', upstream: 'https://open.bigmodel.cn/api/paas/v4', body: { model: 'glm-4', messages: [] } })
check('本地版本段不与上游版本段叠加', sent[0]?.url === 'https://open.bigmodel.cn/api/paas/v4/chat/completions', sent[0]?.url)
ENV.UPSTREAM_ALLOWLIST = 'https://api.openai.com/v1'

sent = []
await call('/v1/embeddings', { ip: '2.2.2.2', body: { model: 'bge-m3', input: ['a', 'b'] } })
check('向量请求不会被塞 max_tokens', !('max_tokens' in JSON.parse(sent[0].init.body)), sent[0].init.body)

await call('/v1/embeddings', { ip: '2.2.2.3', body: { model: 'bge-m3', input: ['a', 'b', 'c', 'd', 'e'] } })
  .then(async (r) => check('一次向量化条数超限被拒', r.status === 400 && sent.length === 1, String(r.status)))

sent = []
response = await call('/v1/models', { method: 'GET', ip: '2.2.2.4' })
check('GET /v1/models 无请求体地转发', sent[0]?.init.method === 'GET' && !sent[0].init.body && response.status === 200)

behaviour = { status: 200, type: 'text/event-stream', body: 'data: {"choices":[{"delta":{"content":"a"}}]}\n\n' }
sent = []
response = await call('/v1/chat/completions', { ip: '2.2.2.5', body: { model: 'm', messages: [], stream: true } })
check('流式的 content-type 原样返回', response.headers.get('content-type') === 'text/event-stream', response.headers.get('content-type'))
check('流式内容不被缓冲改写', (await response.text()).includes('"delta"'))
check('stream 字段透传', JSON.parse(sent[0].init.body).stream === true)

behaviour = { status: 429, type: 'application/json', body: JSON.stringify({ error: { message: 'quota' } }) }
response = await call('/v1/chat/completions', { ip: '2.2.2.6', body: { model: 'm', messages: [] } })
check('上游状态码如实透传', response.status === 429, String(response.status))

behaviour = 'boom'
response = await call('/v1/chat/completions', { ip: '2.2.2.7', body: { model: 'm', messages: [] } })
check('上游挂了返回 502', response.status === 502, String(response.status))
behaviour = { status: 200, type: 'application/json', body: '{}' }

/* ---------- 4. budget ---------- */

sent = []
const codes = []
for (let i = 0; i < 5; i++) codes.push((await call('/v1/chat/completions', { ip: '3.3.3.3', body: { model: 'm', messages: [] } })).status)
check('超过每分钟额度后 429', codes.join(',') === '200,200,200,429,429', codes.join(','))
check('被限流时不再打上游', sent.length === 3, String(sent.length))

response = await call('/v1/chat/completions', { ip: '4.4.4.4', body: { model: 'm', messages: [{ role: 'user', content: 'x'.repeat(4000) }] } })
check('超大请求体 413', response.status === 413, String(response.status))

console.log(failures.length ? `\n${failures.length} 项不通过：${failures.join('、')}` : '\n全部通过')
process.exit(failures.length ? 1 : 0)
