/**
 * 全仓 emoji 守卫：ESLint 看不进注释，也读不了 .mdx 正文，这一半由这里兜住。
 *
 *   node scripts/check-emoji.mjs
 *
 * 规则：源码与注释里一律不许有 emoji；教程正文只在代码围栏之外不许有——
 * 课文里那些「客服风格带 emoji」的例子是在讲题目本身，删掉等于改题。
 * 退出码非 0 表示还有残留，可以直接挂进 CI。
 */
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, extname, relative } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SKIP = new Set([
  'node_modules',
  '.next',
  'out',
  'dist',
  '.git',
  '.qoder-scratch',
  '.qoder-shots',
  '.playwright-mcp',
  // 第三方 skill 文档：不参与构建，清洗过的内容下次更新也会被覆盖。
  '.claude',
  '.agents',
])
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.json', '.yaml', '.yml'])
const TEXT_EXT = new Set(['.mdx', '.md'])
const FENCE = /^(\s*)(```|~~~)/

/** 图形表情区与变体选择符。箭头、星号、破折号、带圈数字这类排版符号不在字符集内。 */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}\u{2139}\u{21A9}-\u{21AA}\u{3030}\u{3297}-\u{3299}]/u

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name) || name.startsWith('.git')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

const findings = []

for (const file of walk(ROOT)) {
  const ext = extname(file)
  if (!CODE_EXT.has(ext) && !TEXT_EXT.has(ext)) continue
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  let inside = false
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (TEXT_EXT.has(ext) && FENCE.test(line)) inside = !inside
      if (TEXT_EXT.has(ext) && inside) return
      const hit = line.match(new RegExp(EMOJI.source, 'gu'))
      if (hit) findings.push(`${rel}:${i + 1}  ${hit.join('')}  ${line.trim().slice(0, 70)}`)
    })
}

for (const f of findings) console.log(f)
console.log(findings.length ? `\n发现 ${findings.length} 处 emoji，界面不允许出现。` : 'emoji 检查通过')
process.exit(findings.length ? 1 : 0)
