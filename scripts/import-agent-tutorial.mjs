/**
 * Imports the agent tutorial markdown into MDX snapshots for /learn/agent.
 *
 *   node scripts/import-agent-tutorial.mjs [sourceRoot]
 *
 * The tutorial lives outside this repo and GitHub Actions cannot read it, so
 * the generated files under content/curriculum/agent are committed as a
 * snapshot and proofread by hand. Re-running overwrites them.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs'
import { join, basename, dirname, relative } from 'path'

const SRC = process.argv[2] || 'D:/study/AI/agent/agent-tutorial'
const OUT = join(process.cwd(), 'content', 'curriculum', 'agent')

const WEEKS = {
  0: { title: '环境搭建', blurb: 'Python 虚拟环境、API Key、WSL Docker，跑通第一个 Hello Agent。' },
  1: { title: 'LangChain 核心组件', blurb: 'LLM 接入、Prompt 模板、结构化输出、LCEL 管道、工具系统。' },
  2: { title: 'RAG 与 Milvus', blurb: 'Embedding 与向量检索、文本切分、Milvus 部署、端到端 RAG 管线。' },
  3: { title: 'RAG 优化与评估', blurb: '查询改写、混合检索与重排序、父子文档、RAGAS 指标打分。' },
  4: { title: 'LangGraph 图编程', blurb: 'State / Node / Edge、条件边与循环、人在回路、持久化与子图。' },
  5: { title: 'Agent 开发', blurb: 'create_agent、Runtime 生命周期、Middleware、长期记忆 Store。' },
  6: { title: 'LangSmith 可观测', blurb: '全链路追踪、调试与标注、Datasets 离线评估、在线监控告警。' },
  7: { title: 'MCP 与多智能体', blurb: 'MCP 协议与适配器、Supervisor 主管路由、Swarm 交接模式。' },
  8: { title: 'Chat UI 与毕业项目', blurb: 'Agent Chat UI、服务化与部署，综合毕业项目从零到上线。' },
}

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{1F1E6}-\u{1F1FF}]/gu

/** 提示类段落在删掉表情符号后会留下连续空白，这里一并收敛成单个空格。 */
const stripInlineEmoji = (text) => text.replace(EMOJI, '').replace(/[ \t]{2,}/g, ' ')

/** Split a markdown source into lines, tagging whether each sits inside a fenced block. */
function tagFences(lines) {
  let open = false
  return lines.map((line) => {
    const isFence = /^(\s*)(```|~~~)/.test(line)
    const tagged = { line, inFence: open }
    if (isFence) {
      // The opening fence line itself is code; the closing one is not.
      if (!open) tagged.inFence = true
      open = !open
    }
    return tagged
  })
}

function yamlQuote(value) {
  const needs = /^$|[:#\[\]{}&*!|>'"%@`,]|^\s|\s$/.test(value)
  const escaped = value.replace(/'/g, "''")
  return needs || /["]/.test(value) ? `'${escaped}'` : value
}

/** Turn a JS value into a single-line MDX prop expression. */
const expr = (value) => JSON.stringify(value)

function escapeAngle(text) {
  // Outside code spans, a `<` before anything but a letter or `/` would be read
  // as JSX. Placeholders like `<包名>` and comparisons like `< 10s` are common.
  let out = ''
  let inCode = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '`') {
      inCode = !inCode
      out += ch
      continue
    }
    if (!inCode && ch === '<' && !/[a-zA-Z/]/.test(text[i + 1] || '')) {
      out += '&lt;'
      continue
    }
    out += ch
  }
  return out
}

/** Collect the body of a `## N.M <match>` section, excluding its own heading. */
function takeSection(blocks, match) {
  const index = blocks.findIndex((b) => b.kind === 'heading' && match.test(b.text))
  if (index === -1) return null
  const heading = blocks[index]
  const body = []
  let i = index + 1
  while (i < blocks.length && blocks[i].kind !== 'heading') {
    body.push(blocks[i])
    i++
  }
  return { index, heading, body, end: i }
}

function classify(line) {
  const t = line.trim()
  if (/^#{1,6}\s/.test(t)) return { kind: 'heading', text: t.replace(/^#{1,6}\s*/, ''), depth: t.match(/^#+/)[0].length }
  if (/^(\s*)(```|~~~)/.test(line)) return { kind: 'fence', text: line }
  if (/^[-*]\s/.test(t)) return { kind: 'bullet', text: t }
  if (/^\d+\.\s/.test(t)) return { kind: 'numbered', text: t, num: Number(t.match(/^(\d+)\./)[1]) }
  if (/^\|/.test(t)) return { kind: 'table', text: t }
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) return { kind: 'hr', text: t }
  if (!t) return { kind: 'blank', text: '' }
  return { kind: 'text', text: t }
}

function parseQuiz(body) {
  const items = []
  let current = null
  for (const b of body) {
    if (b.kind === 'numbered') {
      if (current) items.push(current.trim())
      current = b.text.replace(/^\d+\.\s*/, '')
    } else if (b.kind === 'text' && current && /^\w?\s*\S/.test(b.text) && !/^[*_]{2}/.test(b.text)) {
      current += ' ' + b.text
    } else if (b.kind === 'blank' || b.kind === 'hr') {
      if (b.kind === 'hr' && current) {
        items.push(current.trim())
        current = null
        break
      }
      continue
    } else if (b.kind === 'heading') {
      break
    }
  }
  if (current) items.push(current.trim())
  return items.filter(Boolean)
}

function parseGotchaTable(body) {
  const rows = []
  for (const b of body) {
    if (b.kind !== 'table') continue
    const cells = b.text.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())
    if (cells.length < 2) continue
    if (/^:?-{2,}:?$/.test(cells[0])) continue // separator row
    if (cells[0] === '现象') continue // header row
    rows.push({ symptom: cells[0], cause: cells[1] || '', fix: cells[2] || '' })
  }
  return rows
}

function findSourceFiles(root) {
  const found = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'examples' || entry.name.startsWith('.')) continue
        if (entry.name === 'notes' || entry.name === 'docker') continue
        walk(p)
      } else if (/^day-\d+\.md$/.test(entry.name)) {
        found.push(p)
      }
    }
  }
  walk(root)
  return found.sort()
}

function weekOf(file) {
  const dir = basename(dirname(file))
  if (dir === 'day-00-environment') return 0
  const m = dir.match(/^week-(\d+)/)
  return m ? Number(m[1]) : 0
}

function main() {
  if (!existsSync(SRC)) {
    console.error(`Tutorial source not found: ${SRC}`)
    console.error('Pass the tutorial root as the first argument.')
    process.exit(1)
  }

  const files = findSourceFiles(SRC)
  if (files.length === 0) {
    console.error('No day-*.md files found. Nothing imported.')
    process.exit(1)
  }

  mkdirSync(OUT, { recursive: true })

  const lessons = []
  const warnings = []

  for (const file of files) {
    const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
    const tagged = tagFences(raw.split('\n'))

    const blocks = []
    for (let i = 0; i < tagged.length; i++) {
      const { line, inFence } = tagged[i]
      const c = classify(line)
      blocks.push({ ...c, raw: line, inFence, index: i })
    }

    const h1 = blocks.find((b) => b.kind === 'heading' && b.depth === 1 && !b.inFence)
    if (!h1) {
      warnings.push(`${basename(file)}: no H1, skipped`)
      continue
    }

    const h1Text = h1.text.replace(EMOJI, '').trim()
    const dayMatch = h1Text.match(/^Day\s*(\d+)\s*[：:]\s*(.*)$/)
    if (!dayMatch) {
      warnings.push(`${basename(file)}: H1 is not "Day N：…" — ${h1Text}`)
      continue
    }
    const day = Number(dayMatch[1])
    const lessonTitle = dayMatch[2].trim()
    const slug = `day-${String(day).padStart(2, '0')}`
    const week = weekOf(file)

    // The two blockquote lines right after the H1 carry the goal and the example files.
    let lead = ''
    const examples = []
    for (const b of blocks.slice(0, 14)) {
      if (!/>/.test(b.raw) || b.inFence) continue
      const q = b.raw.replace(/^\s*>\s?/, '').trim()
      if (!lead) {
        const m = q.match(/^今日目标[：:]\s*(.*)$/)
        if (m) {
          lead = m[1].trim()
          b.__consumed = true
        }
      }
      if (!examples.length) {
        const m = q.match(/^配套案例[：:]\s*(.*)$/)
        if (m) {
          for (const f of m[1].matchAll(/`([^`]+)`/g)) examples.push(f[1])
          b.__consumed = true
        }
      }
    }
    if (!lead) warnings.push(`${slug}: no 今日目标`)

    // Everything from the H1 onwards, minus the pieces we replace with components.
    const body = blocks.slice(blocks.indexOf(h1) + 1)

    const quiz = takeSection(body, /今日自测/)
    const gotcha = takeSection(body, /常见坑/)

    // Completion banner: the final `**Day N 完成！** …` paragraph.
    let complete = null
    for (let i = body.length - 1; i >= 0; i--) {
      const b = body[i]
      if (b.kind === 'blank' || b.kind === 'hr') continue
      if (b.kind === 'text' && /\*\*Day\s*\d+\s*完成\s*[!！]\*\*/.test(b.text)) {
        complete = b
        b.__consumed = true
      }
      break
    }

    const out = []
    for (let i = 0; i < body.length; i++) {
      const b = body[i]
      if (b.__consumed) continue
      if (quiz && i === quiz.index) {
        out.push({ raw: '', kind: 'blank' })
        out.push({ raw: `## ${quiz.heading.text.replace(EMOJI, '').trim()}`.replace(/\s+$/, ''), kind: 'heading' })
        out.push({ raw: '', kind: 'blank' })
        out.push({ raw: `<Quiz items={${expr(quiz.body ? parseQuiz(quiz.body) : [])}} />`, kind: 'text' })
        out.push({ raw: '', kind: 'blank' })
        i = quiz.end - 1
        continue
      }
      if (gotcha && i === gotcha.index) {
        out.push({ raw: '', kind: 'blank' })
        out.push({ raw: `## ${gotcha.heading.text.replace(EMOJI, '').trim()}`.replace(/\s+$/, ''), kind: 'heading' })
        out.push({ raw: '', kind: 'blank' })
        out.push({ raw: `<GotchaTable rows={${expr(parseGotchaTable(gotcha.body))}} />`, kind: 'text' })
        out.push({ raw: '', kind: 'blank' })
        i = gotcha.end - 1
        continue
      }
      if (quiz && i > quiz.index && i < quiz.end) continue
      if (gotcha && i > gotcha.index && i < gotcha.end) continue
      out.push(b)
    }

    if (complete) {
      const text = complete.text.replace(/^\*\*Day\s*\d+\s*完成\s*[!！]\*\*\s*/, '').trim()
      out.push({ raw: '', kind: 'blank' })
      out.push({ raw: `<DayComplete day={${day}} recap={${expr(text)}} />`, kind: 'text' })
    }

    // Serialise with fence-aware escaping.
    const rendered = []
    let inFence = false
    let prevBlank = true
    for (const b of out) {
      const line = b.raw ?? ''
      const isFence = /^(\s*)(```|~~~)/.test(line)
      if (isFence) inFence = !inFence

      let value = line
      if (!inFence && !isFence && line.trim()) {
        if (/^#{1,6}\s/.test(line.trim())) value = stripInlineEmoji(line).replace(/^(#{1,6})\s+/, '$1 ')
        else value = escapeAngle(stripInlineEmoji(line))
      }

      if (!value.trim()) {
        if (!prevBlank) rendered.push('')
        prevBlank = true
        continue
      }
      rendered.push(value.replace(/\s+$/, ''))
      prevBlank = false
    }

    const fm = [
      `slug: ${slug}`,
      `day: ${day}`,
      `week: ${week}`,
      `weekTitle: ${yamlQuote(WEEKS[week]?.title || `第 ${week} 周`)}`,
      `weekBlurb: ${yamlQuote(WEEKS[week]?.blurb || '')}`,
      `title: ${yamlQuote(lessonTitle)}`,
      lead ? `lead: ${yamlQuote(lead)}` : null,
      examples.length ? `examples:\n${examples.map((e) => `  - ${yamlQuote(e)}`).join('\n')}` : null,
      `sourcePath: ${yamlQuote(relative(SRC, file).replace(/\\/g, '/'))}`,
    ].filter(Boolean)

    const mdx = `---\n${fm.join('\n')}\n---\n\n${rendered.join('\n')}\n`
    writeFileSync(join(OUT, `${slug}.mdx`), mdx, 'utf8')

    lessons.push({ slug, day, week, title: lessonTitle, quiz: quiz ? parseQuiz(quiz.body).length : 0, gotcha: gotcha ? parseGotchaTable(gotcha.body).length : 0 })
  }

  lessons.sort((a, b) => a.day - b.day)
  const quizless = lessons.filter((l) => !l.quiz).map((l) => l.slug)
  const gotchaless = lessons.filter((l) => !l.gotcha).map((l) => l.slug)

  console.log(`Imported ${lessons.length} lessons -> content/curriculum/agent`)
  console.log(`  quiz items: ${lessons.reduce((a, l) => a + l.quiz, 0)} across ${lessons.length - quizless.length} lessons`)
  console.log(`  gotcha rows: ${lessons.reduce((a, l) => a + l.gotcha, 0)} across ${lessons.length - gotchaless.length} lessons`)
  if (quizless.length) console.log(`  no 今日自测: ${quizless.join(', ')}`)
  if (gotchaless.length) console.log(`  no 常见坑速查: ${gotchaless.join(', ')}`)
  if (warnings.length) {
    console.log('\nwarnings:')
    for (const w of warnings) console.log('  -', w)
  }
}

main()
