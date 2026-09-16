/**
 * 构建产物安全审计：对 out/ 做离线检查，发现真实泄漏或可疑注入点即退出码 1。
 *
 *   npm run build && npm run audit:build
 *
 * 本站的攻击面只有两块：静态 HTML/JS（内容全部出自仓库，风险是"构建时把
 * 秘密带出去"）和 Cloudflare Worker（由 test-proxy-attacks.mjs 离线覆盖）。
 * 这个脚本盯第一块：
 *   1. 秘密模式扫描——密钥、令牌、私钥块不得出现在任何产物里
 *   2. 禁止泄漏的文件类别——.env*、源 .md/.mdx、source map 不得进入 out/
 *   3. 内联事件处理器抽查——正文渲染走 React 转义，不应出现 on*= 的 HTML 注入点
 *   4. 脚本外链域名清单——新增未知第三方域名时人工过目
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { join, relative, extname } from 'path'

const OUT = join(process.cwd(), 'out')
const findings = []
const fail = (msg) => findings.push(msg)

if (!existsSync(OUT)) {
  console.error('out/ 不存在——请先 npm run build')
  process.exit(2)
}

const SECRET_PATTERNS = [
  [/sk-[A-Za-z0-9_-]{20,}/, 'OpenAI 风格密钥'],
  [/gsk_[A-Za-z0-9]{20,}/, '智谱密钥'],
  [/sk-or-[A-Za-z0-9-]{20,}/, 'OpenRouter 密钥'],
  [/AIza[0-9A-Za-z_-]{30,}/, 'Google API Key'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack 令牌'],
  [/ghp_[A-Za-z0-9]{30,}/, 'GitHub PAT'],
  [/gh_[A-Za-z0-9]{30,}/, 'GitHub 令牌'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, '私钥块'],
  [/AKIA[0-9A-Z]{16}/, 'AWS Access Key'],
]

/** 值应公开的例外：NEXT_PUBLIC_* 的值本来就是给浏览器看的。 */
const isPublicValue = (line) => /NEXT_PUBLIC_/.test(line)

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

const files = walk(OUT)

/* ── 1. 秘密扫描（文本类产物）── */
let scanned = 0
for (const file of files) {
  const ext = extname(file)
  if (!['.html', '.js', '.css', '.json', '.xml', '.txt', '.svg', '.md'].includes(ext)) continue
  scanned++
  const text = readFileSync(file, 'utf8')
  const rel = relative(OUT, file)
  for (const [pattern, label] of SECRET_PATTERNS) {
    const hits = text.match(new RegExp(pattern.source, 'g'))
    if (hits) fail(`疑似${label}泄漏于 out/${rel}: ${hits[0].slice(0, 12)}…`)
  }
  for (const line of text.split('\n')) {
    if (/^\.env/.test(line) && !isPublicValue(line)) fail(`疑似 .env 内容进入 out/${rel}: ${line.trim().slice(0, 60)}`)
  }
}
console.log(`秘密扫描：${scanned} 个文本产物，0 命中即通过`)

/* ── 2. 禁止泄漏的文件类别 ── */
const forbidden = [
  [/\.env/, '环境变量文件'],
  [/\.map$/, 'source map（会暴露源码）'],
  [/\.mdx?$/, '内容源文件（应只存在于 HTML）'],
  [/package-lock\.json$/, '依赖清单'],
]
for (const file of files) {
  const rel = relative(OUT, file).replace(/\\/g, '/')
  for (const [pattern, label] of forbidden) {
    if (pattern.test(rel)) fail(`禁止产物：out/${rel}（${label}）`)
  }
}

/* ── 3. 内联事件处理器：正文渲染必须走 React 转义，不允许 on*= 注入点 ── */
for (const file of files.filter((f) => extname(f) === '.html')) {
  const rel = relative(OUT, file).replace(/\\/g, '/')
  const text = readFileSync(file, 'utf8')
  const handlers = text.match(/\son(error|load|click|mouseover)=/gi)
  if (handlers) fail(`HTML 内联事件处理器出现于 out/${rel}: ${[...new Set(handlers)].join(' ')}`)
}

/* ── 4. 外部脚本域名清单（人工过目用，只报告不判失败）── */
const scriptHosts = new Set()
for (const file of files.filter((f) => extname(f) === '.html')) {
  const text = readFileSync(file, 'utf8')
  for (const m of text.matchAll(/<script[^>]*\ssrc=["']https?:\/\/([^/"']+)/g)) {
    scriptHosts.add(m[1])
  }
}
const known = new Set([process.env.SITE_HOST || 'luvisage.github.io', 'www.googletagmanager.com', 'giscus.app'])
const unknown = [...scriptHosts].filter((h) => !known.has(h) && !h.endsWith('giscus.app'))
console.log(`外链脚本域名：${[...scriptHosts].join(', ') || '（无）'}`)
if (unknown.length) console.log(`  [待人工确认] 非白名单域名：${unknown.join(', ')}`)

console.log(`\n审计文件总数：${files.length}`)
if (findings.length) {
  console.error(`\n${findings.length} 项发现：`)
  for (const f of findings) console.error(`  - ${f}`)
  process.exit(1)
}
console.log('构建产物审计通过')
