/**
 * Imports the CSP sprint tutorial into MDX snapshots for /learn/csp.
 *
 *   node scripts/import-csp-tutorial.mjs [sourceRoot]
 *
 * The tutorial lives outside this repo and GitHub Actions cannot read it, so the
 * generated files under content/curriculum/csp are committed as a snapshot and
 * proofread by hand. Re-running overwrites them.
 *
 * What the conversion changes, and why:
 *   - the emoji nav blockquote under each H1 goes away: week hops, prev/next and
 *     the reference pages are already rendered by the course chrome;
 *   - 今日目标 becomes the lesson lead;
 *   - `- [ ]` runs become <Checklist> so the ticks survive a reload;
 *   - 验收标准 becomes <Quiz>, which is also where 标记完成 lives;
 *   - a bare `Day 17` in prose becomes a link to that lesson;
 *   - Luogu codes get their problem URL. CSP session codes (202104-2) are left
 *     alone on purpose — there is no stable public per-problem page for those.
 *   - the 「每日文档位置」 note is dropped: those folders only exist on disk.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs'
import { join, basename, dirname, relative } from 'path'

const SRC = process.argv[2] || 'D:/study/competion'
const OUT = join(process.cwd(), 'content', 'curriculum', 'csp')
const ROUTE = '/learn/csp'

const WEEKS = {
  1: {
    title: '恢复与稳分',
    blurb: '找回手感，把 T1/T2/T3 的 300 分焊死：STL 总复习、T1 限时、前缀和差分双指针、二分排序贪心、map 哈希数学，再加两天大模拟。',
  },
  2: {
    title: '进阶算法',
    blurb: '给 T4 备武器：KMP 与字符串哈希、并查集与最小生成树、最短路拓扑排序、树状数组线段树、线性/背包/区间/树形/状压 DP、搜索与剪枝。',
  },
  3: {
    title: '攻坚与冲刺',
    blurb: 'T4 真题按考点攻坚、T5 部分分策略，两套 4 小时全真模拟，最后回到模板默写、错题本与考场策略。',
  },
}

/** Reference pages stand beside the day sequence; `order` fixes their listing. */
const REFERENCES = [
  { file: 'CSP-20天冲刺教程.md', slug: 'plan', order: 1, label: '20 天冲刺教程' },
  { file: 'CSP-代码模板速查.md', slug: 'templates', order: 2, label: '代码模板速查手册' },
]

/** Local filenames the tutorial cross-links with, mapped onto generated routes. */
const LOCAL_LINKS = new Map(REFERENCES.map((r) => [r.file, `${ROUTE}/${r.slug}`]))

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu

function yamlQuote(value) {
  const needs = /^$|[:#\[\]{}&*!|>'"%@`,]|^\s|\s$/.test(value)
  const escaped = value.replace(/'/g, "''")
  return needs || /["]/.test(value) ? `'${escaped}'` : value
}

const stripEmoji = (text) => text.replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim()

/** Turn a JS value into a single-line MDX prop expression. */
const expr = (value) => JSON.stringify(value)

/** Cut a trailing parenthetical: 「个人 checklist 模板（按你的复盘补充）」→ 前者. */
const cutParen = (text) => text.replace(/\s*[（(][^（）()]*[）)]\s*$/, '').trim()
const clean = (text) => cutParen(text.replace(/[：:]\s*$/, ''))

function escapeAngle(text) {
  // Outside code spans a `<` before anything but a letter or `/` reads as JSX.
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

/** Wrap bare Luogu problem codes in a link, skipping code spans and existing links. */
function linkifyProblems(line) {
  const holes = []
  const masked = line.replace(/`[^`]*`|\[[^\]]*\]\([^)]*\)/g, (m) => {
    holes.push(m)
    return `\u0000${holes.length - 1}\u0000`
  })
  const linked = masked.replace(/\bP(\d{3,6})\b/g, '[P$1](https://www.luogu.com.cn/problem/P$1)')
  return linked.replace(/\u0000(\d+)\u0000/g, (_, i) => holes[Number(i)])
}

/** Point a plain-text `Day NN` mention at the generated lesson. */
function linkifyDays(line) {
  const holes = []
  const masked = line.replace(/`[^`]*`|\[[^\]]*\]\([^)]*\)/g, (m) => {
    holes.push(m)
    return `\u0000${holes.length - 1}\u0000`
  })
  const linked = masked.replace(/\bDay\s*(0?[1-9]|[12]\d)\b(?! ?[-–—~～])/g, (m, d) => {
    const day = Number(d)
    return day >= 1 && day <= 20 ? `[${m}](${ROUTE}/day-${String(day).padStart(2, '0')})` : m
  })
  return linked.replace(/\u0000(\d+)\u0000/g, (_, i) => holes[Number(i)])
}

/** Point a relative `.md` link at the generated route instead of a local file. */
function rewriteLocalLinks(line) {
  return line.replace(/\]\((?!https?:\/\/)[^)]*?\.md(?:#[^)]*)?\)/g, (m) => {
    const target = m.slice(2, -1).split('#')[0]
    const name = basename(target)
    const route = LOCAL_LINKS.get(name)
    if (route) return `](${route})`
    const day = name.match(/^Day(\d{2})/)
    return `](${ROUTE}${day ? `/day-${day[1]}` : ''})`
  })
}

/** 「配合《CSP-20天冲刺教程.md》使用」 — on the site that file is a titled page. */
function nameFiles(text) {
  return text.replace(/《([^》]+)\.md》/g, (m, name) => {
    const ref = REFERENCES.find((r) => r.file.replace(/\.md$/, '') === name)
    return ref ? `《${ref.label}》` : m
  })
}

function classify(line) {
  const t = line.trim()
  if (/^#{1,6}\s/.test(t)) return { kind: 'heading', text: t.replace(/^#{1,6}\s*/, ''), depth: t.match(/^#+/)[0].length }
  if (/^(\s*)(```|~~~)/.test(line)) return { kind: 'fence', text: line }
  if (/^[-*]\s+\[[ xX]\]\s+/.test(t)) return { kind: 'task', text: t.replace(/^[-*]\s+\[[ xX]\]\s+/, '') }
  if (/^[-*]\s/.test(t)) return { kind: 'bullet', text: t }
  if (/^\d+\.\s/.test(t)) return { kind: 'numbered', text: t }
  if (/^\|/.test(t)) return { kind: 'table', text: t }
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) return { kind: 'hr', text: t }
  if (/^>/.test(t)) return { kind: 'quote', text: t.replace(/^>\s?/, '') }
  if (!t) return { kind: 'blank', text: '' }
  return { kind: 'text', text: t }
}

/** Lines, each tagged with whether it sits inside a fenced block. */
function splitBlocks(raw) {
  let open = false
  return raw.split('\n').map((line) => {
    const isFence = /^(\s*)(```|~~~)/.test(line)
    const inFence = isFence ? true : open
    if (isFence && open) open = false
    else if (isFence) open = true
    return { ...classify(line), raw: line, inFence, literal: false }
  })
}

/** Body of a `## <match>` section: heading index, the blocks under it, and where it ends. */
function takeSection(blocks, match) {
  const index = blocks.findIndex((b) => b.kind === 'heading' && !b.inFence && match.test(b.text))
  if (index === -1) return null
  let end = index + 1
  while (end < blocks.length && !(blocks[end].kind === 'heading' && !blocks[end].inFence)) end++
  return { index, heading: blocks[index], body: blocks.slice(index + 1, end), end }
}

function listItems(body) {
  const items = []
  for (const b of body) {
    if (b.kind === 'bullet' || b.kind === 'numbered') {
      items.push(b.text.replace(/^([-*]|\d+\.)\s+/, '').replace(/[；;]\s*$/, ''))
      continue
    }
    if (b.kind === 'text' && items.length) items[items.length - 1] += ' ' + b.text
  }
  return items.filter(Boolean)
}

const FALLBACK_LIST = '自查清单'

/** Last parenthetical of a line: 「自查清单（逐条过）」→ 后者. */
const parenOf = (text) => text.match(/[（(]([^（）()]*)[）)]\s*$/)?.[1].trim() ?? ''

/**
 * Label for a task run. A bold lead-in wins — its parenthetical is the author's
 * instruction, so it is handed back too and the importer can keep it as prose.
 * Otherwise the enclosing heading, which the page renders anyway.
 */
function labelAbove(blocks, start) {
  for (let i = start - 1; i >= 0; i--) {
    const b = blocks[i]
    if (b.kind === 'blank' || b.kind === 'hr' || b.kind === 'quote') continue
    if (b.kind === 'heading') return { name: clean(stripEmoji(b.text.replace(/\*\*/g, ''))) || FALLBACK_LIST }
    const bold = b.raw.trim().match(/^\*\*(.+?)\*\*[：:]?$/)
    if (bold) {
      // Sources write 「**自查清单（…）：**」, colon inside the bold span.
      const whole = stripEmoji(bold[1]).replace(/[：:]\s*$/, '')
      return { name: clean(whole) || FALLBACK_LIST, index: i, advice: parenOf(whole) }
    }
  }
  return { name: FALLBACK_LIST }
}

/** Serialise, fence-aware: markup fixes only ever touch prose lines. */
function render(blocks) {
  const lines = []
  let prevBlank = true
  for (const b of blocks) {
    let value = b.raw ?? ''
    if (!b.inFence && !b.literal && value.trim()) {
      if (/^#{1,6}\s/.test(value.trim())) value = stripEmoji(value).replace(/^(#{1,6})\s+/, '$1 ')
      else
        value = escapeAngle(
          nameFiles(
            rewriteLocalLinks(linkifyDays(linkifyProblems(stripEmoji(value)))),
          ).replace(/<br\s*\/?>/gi, '<br />'),
        )
    }
    if (!value.trim()) {
      if (!prevBlank) lines.push('')
      prevBlank = true
      continue
    }
    lines.push(value.replace(/\s+$/, ''))
    prevBlank = false
  }
  return lines.join('\n')
}

/** Blank and `---` padding left where the nav blockquote was cut. */
function trimEdges(blocks) {
  let start = 0
  let end = blocks.length
  const edge = (b) => b.kind === 'blank' || b.kind === 'hr'
  while (start < end && edge(blocks[start])) start++
  while (end > start && edge(blocks[end - 1])) end--
  return blocks.slice(start, end)
}

/**
 * 「每日文档位置：第 1 周：`第1周-Day01-07-…`」 points at folders on the author's
 * disk. The course chrome already lists the days, so the note carries nothing here.
 */
function dropFilePointers(blocks) {
  const start = blocks.findIndex((b) => b.kind === 'text' && !b.inFence && /^每日文档位置/.test(b.text))
  if (start === -1) return blocks
  let end = start + 1
  while (end < blocks.length) {
    if (blocks[end].kind === 'bullet') end++
    else if (blocks[end].kind === 'blank' && blocks[end + 1]?.kind === 'bullet') end++
    else break
  }
  return [...blocks.slice(0, start), ...blocks.slice(end)]
}

function frontmatter(fields) {
  return `---\n${fields.filter(Boolean).join('\n')}\n---\n`
}

function readDay(file, warnings) {
  const blocks = splitBlocks(readFileSync(file, 'utf8').replace(/\r\n/g, '\n'))
  const h1 = blocks.find((b) => b.kind === 'heading' && b.depth === 1 && !b.inFence)
  if (!h1) {
    warnings.push(`${basename(file)}: no H1, skipped`)
    return null
  }
  const day = Number(h1.text.match(/^Day\s*(\d+)/)?.[1])
  if (!Number.isFinite(day)) {
    warnings.push(`${basename(file)}: H1 is not "Day N：…" — ${h1.text}`)
    return null
  }
  // H1 titles keep their parentheticals: 「T2 技巧①——前缀和 / 差分 / 双指针」 is the title.
  const title = stripEmoji(h1.text).replace(/^Day\s*\d+\s*[：:]\s*/, '').trim()
  const slug = `day-${String(day).padStart(2, '0')}`
  const week = Number(basename(dirname(file)).match(/第(\d+)周/)?.[1] ?? 0)
  if (!WEEKS[week]) warnings.push(`${slug}: unknown week in folder ${basename(dirname(file))}`)

  // The nav blockquote right under the H1: keep 今日目标, drop the rest.
  const body = blocks.slice(blocks.indexOf(h1) + 1)
  let lead = ''
  let consumed = 0
  for (let i = 0; i < body.length; i++) {
    const b = body[i]
    if (b.kind === 'blank') {
      if (consumed === i) consumed = i + 1
      continue
    }
    if (b.kind !== 'quote') break
    consumed = i + 1
    const m = b.text.match(/今日目标\s*[：:]\s*(.+)$/)
    if (m) lead = stripEmoji(m[1])
  }
  if (!lead) warnings.push(`${slug}: no 今日目标`)

  return { day, week, slug, title, lead, file, blocks: trimEdges(body.slice(consumed)) }
}

function importDay(lesson) {
  const blocks = lesson.blocks
  const listNames = new Map()

  // 1. Each contiguous `- [ ]` run becomes one <Checklist>.
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].kind !== 'task' || blocks[i].inFence) continue
    let end = i
    while (blocks[end + 1]?.kind === 'task' && !blocks[end + 1].inFence) end++
    const items = blocks.slice(i, end + 1).map((b) => b.text.replace(/[；;]\s*$/, ''))
    const label = labelAbove(blocks, i)
    const seen = (listNames.get(label.name) ?? 0) + 1
    listNames.set(label.name, seen)
    const name = seen > 1 ? `${label.name} ${seen}` : label.name
    if (label.index !== undefined) {
      // The eyebrow now says what the bold line said, so only its advice is left.
      const advice = label.advice
      blocks[label.index] = {
        kind: 'text',
        text: advice,
        raw: advice ? (/[。.!?]$/.test(advice) ? advice : `${advice}。`) : '',
        inFence: false,
        literal: false,
      }
    }
    blocks.splice(i, end - i + 1, {
      kind: 'component',
      raw: `<Checklist name={${expr(name)}} items={${expr(items)}} />`,
      inFence: false,
      literal: true,
    })
  }

  // 2. 验收标准 becomes <Quiz>; the heading survives so the TOC still lists it.
  const acceptance = takeSection(blocks, /验收标准/)
  if (acceptance) {
    const items = listItems(acceptance.body)
    blocks.splice(
      acceptance.index,
      acceptance.end - acceptance.index,
      { kind: 'heading', text: '验收标准', depth: 2, raw: '## 验收标准', inFence: false, literal: false },
      { kind: 'blank', raw: '', inFence: false, literal: false },
      { kind: 'component', raw: `<Quiz items={${expr(items)}} />`, inFence: false, literal: true },
      { kind: 'blank', raw: '', inFence: false, literal: false },
    )
  }

  // 3. A 「## 今日模板（摘自速查手册第 7 节）」 heading pointed at a local file.
  //    Say it in prose with a link instead, and leave the heading itself clean.
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.kind !== 'heading' || b.inFence || !/^今日模板/.test(b.text)) continue
    const manual = REFERENCES.find((r) => r.slug === 'templates')
    const sections = (b.text.match(/\d+(?:\s*[、,，]\s*\d+)*/) || [])[0]
    b.text = '今日模板'
    b.raw = `${'#'.repeat(b.depth)} 今日模板`
    blocks.splice(i + 1, 0, { kind: 'blank', raw: '', inFence: false, literal: false })
    blocks.splice(i + 2, 0, {
      kind: 'text',
      text: '',
      raw: `完整版本见[${manual.label}](${ROUTE}/${manual.slug})${sections ? `（第 ${sections} 节）` : ''}。`,
      inFence: false,
      literal: true,
    })
    i += 2
  }

  return frontmatter([
    `slug: ${lesson.slug}`,
    'kind: day',
    `day: ${lesson.day}`,
    `week: ${lesson.week}`,
    `weekTitle: ${yamlQuote(WEEKS[lesson.week]?.title || `第 ${lesson.week} 周`)}`,
    `weekBlurb: ${yamlQuote(WEEKS[lesson.week]?.blurb || '')}`,
    `title: ${yamlQuote(lesson.title)}`,
    lesson.lead ? `lead: ${yamlQuote(lesson.lead)}` : null,
    `sourcePath: ${yamlQuote(relative(SRC, lesson.file).replace(/\\/g, '/'))}`,
  ]) + '\n' + render(blocks) + '\n'
}

function importReference(ref, warnings) {
  const file = join(SRC, ref.file)
  const blocks = splitBlocks(readFileSync(file, 'utf8').replace(/\r\n/g, '\n'))
  const h1 = blocks.find((b) => b.kind === 'heading' && b.depth === 1 && !b.inFence)
  if (!h1) {
    warnings.push(`${ref.file}: no H1, skipped`)
    return null
  }
  const title = stripEmoji(h1.text).replace(/\s*[（(][^（）()]*[）)]\s*$/, '').trim()

  // Keep the opening blockquote as the page's own intro, minus the file pointers.
  const body = blocks.slice(blocks.indexOf(h1) + 1)
  let lead = ''
  let consumed = 0
  for (let i = 0; i < body.length; i++) {
    const b = body[i]
    if (b.kind === 'blank') continue
    if (b.kind !== 'quote') break
    consumed = i + 1
    if (!lead) lead = nameFiles(stripEmoji(b.text))
  }

  return frontmatter([
    `slug: ${ref.slug}`,
    'kind: reference',
    `day: ${ref.order}`,
    'week: 0',
    `weekTitle: ${yamlQuote('随查')}`,
    "weekBlurb: ''",
    `title: ${yamlQuote(title)}`,
    lead ? `lead: ${yamlQuote(lead)}` : null,
    `sourcePath: ${yamlQuote(ref.file)}`,
  ]) + '\n' + render(trimEdges(dropFilePointers(body.slice(consumed)))) + '\n'
}

function findDayFiles(root) {
  const found = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.')) continue
        walk(p)
      } else if (/^Day\d{2}-.+\.md$/.test(entry.name)) {
        found.push(p)
      }
    }
  }
  walk(root)
  return found.sort()
}

function main() {
  if (!existsSync(SRC)) {
    console.error(`Tutorial source not found: ${SRC}`)
    console.error('Pass the tutorial root as the first argument.')
    process.exit(1)
  }

  const files = findDayFiles(SRC)
  if (files.length === 0) {
    console.error('No DayNN-*.md files found. Nothing imported.')
    process.exit(1)
  }

  mkdirSync(OUT, { recursive: true })
  const warnings = []
  const rows = []

  for (const file of files) {
    const lesson = readDay(file, warnings)
    if (!lesson) continue
    const mdx = importDay(lesson)
    writeFileSync(join(OUT, `${lesson.slug}.mdx`), mdx, 'utf8')
    rows.push({
      slug: lesson.slug,
      lists: (mdx.match(/<Checklist /g) || []).length,
      quiz: (mdx.match(/<Quiz /g) || []).length || 0,
      problems: (mdx.match(/luogu\.com\.cn\/problem\/P/g) || []).length,
      emoji: (mdx.match(EMOJI) || []).length,
    })
  }

  for (const ref of REFERENCES) {
    const mdx = importReference(ref, warnings)
    if (!mdx) continue
    writeFileSync(join(OUT, `${ref.slug}.mdx`), mdx, 'utf8')
    rows.push({ slug: ref.slug, lists: 0, quiz: 0, problems: 0, emoji: (mdx.match(EMOJI) || []).length })
  }

  const total = (key) => rows.reduce((n, r) => n + r[key], 0)
  console.log(`Imported ${rows.length} pages -> content/curriculum/csp`)
  console.log(`  checklists: ${total('lists')}, quiz blocks: ${total('quiz')}, luogu links: ${total('problems')}`)
  const leftovers = rows.filter((r) => r.emoji)
  if (leftovers.length) console.log(`  emoji left: ${leftovers.map((r) => `${r.slug}(${r.emoji})`).join(', ')}`)
  if (warnings.length) {
    console.log('\nwarnings:')
    for (const w of warnings) console.log('  -', w)
  }
}

main()
