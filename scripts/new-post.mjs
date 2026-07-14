/**
 * 快速生成一篇新文章模板
 *
 * 用法：
 *   node scripts/new-post.mjs "我的文章标题"
 *
 * 可选参数：
 *   --tags "AI,技术,教程"     文章标签（逗号分隔）
 *   --category "技术"         文章分类
 *   --series "系列名"         系列名称
 *   --seriesOrder 2           系列中的序号
 *   --description "文章描述"   文章摘要
 *   --draft                    标记为草稿（不发布）
 *
 * 示例：
 *   node scripts/new-post.mjs "深入理解 React Server Components" --tags "React,Next.js" --category "前端" --description "RSC 原理与实践"
 */

import { writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── 解析参数 ───────────────────────────────────
const args = process.argv.slice(2)
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
📝 新文章生成器

用法：node scripts/new-post.mjs "文章标题" [选项]

选项：
  --tags "标签1,标签2"      标签（逗号分隔）
  --description "描述文本"   文章摘要
  --draft                   标记为草稿

示例：
  node scripts/new-post.mjs "我的第一篇文章"
  node scripts/new-post.mjs "AI Agent 开发入门" --tags "AI,Agent" --description "从零开始构建 AI Agent"
  node scripts/new-post.mjs "草稿文章" --draft
`)
  process.exit(0)
}

const title = args.find((a) => !a.startsWith('--') && !a.startsWith('-'))
if (!title) {
  console.error('❌ 请提供文章标题')
  process.exit(1)
}

function getFlag(name) {
  return args.includes(`--${name}`)
}

function getArg(name) {
  const idx = args.indexOf(`--${name}`)
  if (idx === -1) return undefined
  return args[idx + 1] || ''
}

const description = getArg('description') || ''
const tagsRaw = getArg('tags') || ''
const category = getArg('category') || ''
const series = getArg('series') || ''
const seriesOrderRaw = getArg('seriesOrder') || ''
const seriesOrder = seriesOrderRaw ? parseInt(seriesOrderRaw, 10) : undefined
const draft = getFlag('draft')
const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

// ─── 生成 slug ───────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, '-') // 非字母数字/中文 → 短横线
    .replace(/^-+|-+$/g, '')               // 去掉首尾短横线
    .replace(/-{2,}/g, '-')                // 合并连续短横线
    || 'untitled'
}

const slug = slugify(title)
const tags = tagsRaw
  .split(/[,，]/)
  .map((t) => t.trim())
  .filter(Boolean)
  .map((t) => `  - ${t}`)
  .join('\n')

// ─── 生成 frontmatter ────────────────────────────
const frontmatter = [
  '---',
  `title: '${title}'`,
  `date: '${today}'`,
  description ? `description: '${description}'` : `description: ''`,
  category ? `category: '${category}'` : '',
  series ? `series: '${series}'` : '',
  seriesOrder !== undefined ? `seriesOrder: ${seriesOrder}` : '',
  'tags:',
  tags || '  - AI',
  draft ? 'draft: true' : '',
  '---',
]
  .filter(Boolean)
  .join('\n')

// ─── 生成正文模板 ─────────────────────────────────
const body = `

## 引言

写一段引人入胜的开场白...

## 正文

正文内容在这里。

> 💡 提示：支持 Markdown 语法、代码块、数学公式等

### 代码示例

\`\`\`python
print("Hello, World!")
\`\`\`

## 总结

总结文章的核心观点。

---

*感谢阅读！欢迎在评论区交流讨论。*
`

const content = frontmatter + body

// ─── 写入文件 ───────────────────────────────────
const postsDir = join(__dirname, '..', 'content', 'posts')
const filename = `${slug}.mdx`
const filepath = join(postsDir, filename)

if (existsSync(filepath)) {
  console.error(`❌ 文件已存在：content/posts/${filename}`)
  console.error('   请使用不同的标题或删除已有文件')
  process.exit(1)
}

writeFileSync(filepath, content, 'utf-8')

console.log(`✅ 文章已创建：content/posts/${filename}`)
console.log(`   标题：${title}`)
console.log(`   日期：${today}`)
if (tags) console.log(`   标签：${tagsRaw}`)
if (draft) console.log(`   状态：草稿（不会发布）`)
console.log()
console.log('下一步：')
console.log(`   1. 编辑 content/posts/${filename} 写正文`)
console.log('   2. npm run dev 本地预览')
console.log('   3. git add & git commit & git push 发布')
