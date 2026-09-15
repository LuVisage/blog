/**
 * Imports three tutorial sources into MDX snapshots for /learn.
 *
 *   node scripts/import-tutorials.mjs [devtoolRoot] [mlRoot]
 *
 *   devtool  <- 教程1   （开发工具链，13 章 80+ 篇）
 *   ml       <- 教程    （Week00–16 日课 + 每周清单 + 总路线 + Agent 路线图）
 *   backend  <- 教程/Python工程化与后端实战（Week1–2 日课 + Week3–5 周计划）
 *
 * The tutorials live outside this repo and GitHub Actions cannot read them, so
 * the generated files under content/curriculum/* are committed as snapshots.
 * Re-running overwrites them.
 *
 * Conversion rules, chosen to match scripts/check-emoji.mjs and the MDX parser:
 *   - code fences are copied byte-for-byte (the emoji guard exempts them too);
 *   - prose lines lose emoji, stray `<` and unescaped `{`/`}`;
 *   - `<details>/<summary>` stay raw — balanced and attribute-free in the
 *     sources, so MDX keeps the folded answers;
 *   - `$…$` spans and code spans are protected from all of the above, because
 *     the curriculum renders math through remark-math;
 *   - markdown links that point at another imported lesson file are rewritten
 *     to their final /learn/<course>/<slug> URL — that is what keeps the
 *     cross-references between the three courses alive. Links to files that
 *     were not imported (code folders, PDFs, datasets) drop the link but keep
 *     the text: a dead link is worse than plain text.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs'
import { join, basename, dirname, relative, resolve } from 'path'

const DEVTOOL_SRC = process.argv[2] || 'C:/Users/lusha/Desktop/教程1'
const ML_SRC = process.argv[3] || 'C:/Users/lusha/Desktop/教程'
const BACKEND_SRC = join(ML_SRC, 'Python工程化与后端实战')

const OUT_ROOT = join(process.cwd(), 'content', 'curriculum')

/** Same character set as scripts/check-emoji.mjs, so the guard stays green. */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}\u{2139}\u{21A9}-\u{21AA}\u{3030}\u{3297}-\u{3299}]/gu

/** Prose cleaning: emoji out, and the double spaces they leave behind. */
const stripInlineEmoji = (text) => text.replace(EMOJI, '').replace(/[ \t]{2,}/g, ' ')

// ============================================================
// Week metadata — the connective tissue between courses
// ============================================================
const DEVTOOL_WEEKS = {
  1: { title: '版本控制', blurb: '从 Git 四区模型起步，延伸到 gh / glab、图形客户端、LFS 与提交钩子——后面每门课的作业都从 git init 开始。' },
  2: { title: '包管理与运行时', blurb: 'Node 的 nvm / npm / pnpm / npx，Python 的 venv 与 uv，再到 Java、Rust、Go 的构建工具，装依赖不再靠抄命令。' },
  3: { title: '构建打包', blurb: 'Vite、Webpack、Rollup、esbuild/SWC、Babel 到 TypeScript 编译与 Turbo / Nx / Make 任务编排。' },
  4: { title: '代码检查与格式化', blurb: 'ESLint、Prettier、Biome 与各语言 lint 方案，最后用提交前质量关卡把第 1 周的钩子填上真检查。' },
  5: { title: '测试', blurb: '从 Vitest / Jest 单测到 Playwright / Cypress 端到端，再补 pytest / JUnit / go test，测试金字塔一次配齐。' },
  6: { title: '调试与网络', blurb: 'DevTools 与调试器断点、curl / httpie、抓包、API 客户端与内网穿透——排查问题的完整工具箱。' },
  7: { title: '编辑器与 IDE', blurb: '以 VSCode 为主的配置、快捷键、调试与远程开发，把编辑器用到顺手。' },
  8: { title: '终端与命令行', blurb: 'Shell、常用命令行工具与终端复用，把日常操作脚本化。' },
  9: { title: '容器与部署运维', blurb: 'Docker 镜像与 compose、常见部署形态与基础运维，为后端课的模型服务化打底。' },
  10: { title: 'CI/CD', blurb: '以 GitHub Actions 为主的流水线：构建、测试、发布自动化，把前几周的检查串成一条链。' },
  11: { title: '数据库与中间件', blurb: '常用数据库与缓存、消息中间件的本地搭建与客户端使用，对应后端课的存储层。' },
  12: { title: '日志与监控', blurb: '日志规范、指标与告警的可观测性入门，服务上线后靠它定位问题。' },
  13: { title: '文档与协作', blurb: 'Markdown、API 文档、Storybook、图表与团队协作规范，把知识沉淀下来。' },
}

const ML_WEEKS = {
  0: { title: '零基础起步', blurb: '不会写代码从这里开始：环境与命令行、Python 语法、容器函数类、NumPy、数学直觉。' },
  1: { title: '数学地基与环境', blurb: '开发环境收尾后补齐线性代数、概率、梯度与信息论——后面所有公式都建立在这上面。' },
  2: { title: '机器学习基础', blurb: '西瓜书第 1–2 章：机器学习是什么、模型的评估与选择、性能度量。' },
  3: { title: '线性模型', blurb: '线性回归、逻辑回归与线性判别分析，第一批可解释模型，公式开始密集。' },
  4: { title: '决策树与集成学习', blurb: 'ID3 / C4.5 / CART 与剪枝，再到 Bagging、随机森林与 Boosting。' },
  5: { title: '支持向量机与概率模型', blurb: '间隔与对偶、核方法，以及贝叶斯分类器的概率视角。' },
  6: { title: '无监督学习', blurb: 'K-Means、层次聚类、GMM 与降维，从无标注数据里找结构。' },
  7: { title: '神经网络基础', blurb: '纯 NumPy 手写：感知机、激活函数、反向传播与两层网络的完整训练。' },
  8: { title: '工具链与数据预处理', blurb: 'Pandas / Matplotlib、七种预处理方法、jieba / NLTK 文本处理与特征工程 Pipeline。' },
  9: { title: 'PyTorch 框架与数据管线', blurb: '张量、自动求导、计算图，Dataset / DataLoader 与第一个训练循环。' },
  10: { title: '深度学习进阶', blurb: '过拟合与正则化、批归一化、优化算法与训练曲线诊断。' },
  11: { title: '卷积神经网络', blurb: '卷积与池化、PyTorch 构建 CNN、特征图可视化与经典架构迁移学习。' },
  12: { title: '现代 CNN 与注意力', blurb: '1x1 瓶颈、深度可分离卷积、注意力机制与高效网络设计。' },
  13: { title: '循环神经网络', blurb: 'RNN / BPTT、LSTM / GRU，序列建模与字符级文本生成。' },
  14: { title: 'Transformer 与 ViT', blurb: '自注意力、多头注意力与位置编码，亲手实现 Transformer 并走向 ViT。' },
  15: { title: '计算机视觉实战', blurb: 'OpenCV 基础、滤波与边缘、数据增强、目标检测与迁移学习实战。' },
  16: { title: '生成模型与大语言模型', blurb: 'AE / VAE、GAN、扩散模型到大语言模型——通往 Agent 课程与后端实战的最后一段。' },
}

const BACKEND_WEEKS = {
  1: { title: 'Python 工程化', blurb: '类型注解与数据校验、装饰器、async/await、pytest 与 logging、项目结构与打包——把能跑的脚本变成能维护的工程。' },
  2: { title: 'FastAPI 后端开发', blurb: 'HTTP 与 FastAPI、依赖注入与中间件、JWT 鉴权、SSE 流式输出、错误处理与可观测性。' },
  3: { title: 'PostgreSQL 与 Redis', blurb: '把 Week2 的内存存储换成真正的数据库：参数化查询 / 索引 / N+1，Redis 限流与缓存，事务。' },
  4: { title: 'Docker 与云部署', blurb: 'Docker 多阶段构建、compose、Nginx 的 SSE 配置与 CI/CD。' },
  5: { title: '向量检索与 RAG 工程化', blurb: '切分 / HNSW / 重排 / 引用来源、RAGAS 评估与毕业项目，与 Agent 课程的 RAG 周直接衔接。' },
}

// ============================================================
// markdown helpers (fence / math aware)
// ============================================================
function tagFences(lines) {
  let open = false
  let math = false
  return lines.map((line) => {
    const isFence = /^(\s*)(```|~~~)/.test(line)
    if (!open && !math && isFence) open = true
    else if (open && isFence) open = false
    // A line with an odd number of $$ toggles display-math mode; any line
    // holding $$ at all is treated as math and copied verbatim.
    const dollarCount = (line.match(/\$\$/g) || []).length
    const inMath = math
    if (!open && dollarCount > 0) {
      if (dollarCount % 2 === 1) math = !math
    }
    return {
      line,
      // `isFence` keeps the CLOSING fence line verbatim too — collapse its
      // indentation and a fence indented inside a list item no longer closes,
      // swallowing everything after it, closing tags included.
      inFence: open || inMath || dollarCount > 0 || isFence,
      // Single line that carries display math: escaping must stay away, but
      // emoji before the delimiters still have to go (the emoji guard reads
      // every non-fenced line).
      isMathLine: !open && dollarCount > 0,
    }
  })
}

function classify(line) {
  const t = line.trim()
  if (/^#{1,6}\s/.test(t)) return { kind: 'heading', text: t.replace(/^#{1,6}\s*/, ''), depth: t.match(/^#+/)[0].length }
  if (/^(\s*)(```|~~~)/.test(line)) return { kind: 'fence', text: line }
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) return { kind: 'hr', text: t }
  if (!t) return { kind: 'blank', text: '' }
  return { kind: 'text', text: t }
}

function yamlQuote(value) {
  const needs = /^$|[:#\[\]{}&*!|>'"%@`,]|^\s|\s$/.test(value)
  const escaped = value.replace(/'/g, "''")
  return needs || /["]/.test(value) ? `'${escaped}'` : value
}

/** Code spans and paired inline math on a line — their content is left alone. */
function protectedRanges(line) {
  const ranges = []
  const push = (start, end) => { if (end > start) ranges.push([start, end]) }

  // inline math: $…$ with no whitespace hugging the dollars (remark-math rule)
  const math = /\$(?!\s)((?:[^$\n\\]|\\.)+?)(?<!\s)\$/g
  for (const m of line.matchAll(math)) push(m.index, m.index + m[0].length)

  // code spans win where they overlap math
  const code = /(`+)([\s\S]*?)\1/g
  for (const m of line.matchAll(code)) push(m.index, m.index + m[0].length)

  ranges.sort((a, b) => a[0] - b[0])
  const merged = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r[0] < last[1]) last[1] = Math.max(last[1], r[1])
    else merged.push([...r])
  }
  return merged
}

function mapSegments(line, fn) {
  const ranges = protectedRanges(line)
  let out = ''
  let cursor = 0
  for (const [start, end] of ranges) {
    out += fn(line.slice(cursor, start))
    out += line.slice(start, end)
    cursor = end
  }
  out += fn(line.slice(cursor))
  return out
}

/**
 * Rewrite [text](target) links. Targets that resolve to another imported
 * lesson file become absolute /learn URLs via the resolver; everything else
 * (code folders, PDFs, files that were not imported) keeps its text but loses
 * the dead link.
 */
function rewriteLinks(line, resolveTarget) {
  return line.replace(/\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (whole, text, target) => {
    if (/^(https?:|mailto:|#)/i.test(target)) return whole
    const mapped = resolveTarget(target)
    return mapped ? `[${text}](${mapped})` : text
  })
}

/** <details>/<summary> pass through raw so MDX keeps the folded answers. */
const JSX_KEEP = /^<\/?(details|summary)>/

function escapeMdxText(text) {
  let out = ''
  let inMath = false
  let inCode = false
  let i = 0
  while (i < text.length) {
    const keep = JSX_KEEP.exec(text.slice(i))
    if (keep) {
      out += keep[0]
      i += keep[0].length
      continue
    }
    const ch = text[i]
    if (ch === '`') { inCode = !inCode; out += ch; i++; continue }
    if (inCode) { out += ch; i++; continue }
    if (ch === '$') { inMath = !inMath; out += ch; i++; continue }
    if (inMath) { out += ch; i++; continue }
    if (ch === '<') { out += '&lt;'; i++; continue }
    if (ch === '{') { out += '\\{'; i++; continue }
    if (ch === '}') { out += '\\}'; i++; continue }
    out += ch
    i++
  }
  return out
}

function transformLine(line, resolveTarget) {
  let out = line.replace(/<!--[\s\S]*?-->/g, '')
  out = rewriteLinks(out, resolveTarget)
  // <details>/<summary> stay raw: balanced and attribute-free in the sources,
  // so MDX keeps the folded answers instead of flattening them.
  if (/^\s*<\/?(details|summary)[^>]*>\s*$/.test(out)) return out
  out = mapSegments(out, (segment) => escapeMdxText(stripInlineEmoji(segment)))
  // GFM cuts a table cell at every `|` BEFORE inline math is parsed, so a
  // conditional bar like $P(x|y)$ would split the cell and leave `{x}` for
  // the JSX expression parser (ReferenceError at prerender). `\vert` is the
  // same symbol in math mode and survives the cell split.
  if (/^\s*\|/.test(out)) {
    out = out.replace(/\$(?!\s)((?:[^$\n\\]|\\.)+?)(?<!\s)\$/g, (span) =>
      span.replace(/(?<!\\)\|/g, '\\vert'),
    )
  }
  return out
}

// ============================================================
// source inventory
// ============================================================
const pad2 = (n) => String(n).padStart(2, '0')

function weekDirs(root) {
  const weeks = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const m = entry.name.match(/^Week(\d+)_/)
    if (!m) continue
    weeks.push({ week: Number(m[1]), name: entry.name })
  }
  return weeks.sort((a, b) => a.week - b.week)
}

function dayFiles(dir) {
  return readdirSync(dir)
    .filter((f) => /^Day(\d+)_.+\.md$/.test(f))
    .sort((a, b) => Number(a.match(/^Day(\d+)/)[1]) - Number(b.match(/^Day(\d+)/)[1]))
    .map((f) => join(dir, f))
}

function chapterFiles(dir) {
  return readdirSync(dir)
    .filter((f) => /^(\d+)-.+\.md$/.test(f))
    .sort((a, b) => Number(a.match(/^(\d+)-/)[1]) - Number(b.match(/^(\d+)-/)[1]))
    .map((f) => join(dir, f))
}

/** One lesson to import: where it comes from and where it lands. */
function buildPlan() {
  const plan = []
  let day = 0

  // ── devtool：13 章，章内编号文件，day 全课程连续编号 ──
  const chapters = readdirSync(DEVTOOL_SRC, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d+-/.test(e.name))
    .map((e) => ({ week: Number(e.name.match(/^(\d+)-/)[1]), name: e.name }))
    .sort((a, b) => a.week - b.week)
  for (const ch of chapters) {
    for (const file of chapterFiles(join(DEVTOOL_SRC, ch.name))) {
      day += 1
      plan.push({ course: 'devtool', kind: 'day', week: ch.week, day, file })
    }
  }
  plan.push({ course: 'devtool', kind: 'reference', day: 90, week: 0, file: join(DEVTOOL_SRC, 'README.md'), slug: 'path' })

  // ── ml：Week00–16，Day1–5；每周 README 是可检验的复盘清单 ──
  day = 0
  for (const { week, name } of weekDirs(ML_SRC)) {
    for (const file of dayFiles(join(ML_SRC, name))) {
      day += 1
      plan.push({ course: 'ml', kind: 'day', week, day, file })
    }
    plan.push({ course: 'ml', kind: 'reference', week, day: week + 1, file: join(ML_SRC, name, 'README.md'), slug: `week-${pad2(week)}` })
  }
  plan.push({ course: 'ml', kind: 'reference', day: 90, week: 0, file: join(ML_SRC, 'README.md'), slug: 'path' })
  plan.push({ course: 'ml', kind: 'reference', day: 91, week: 0, file: join(ML_SRC, 'Agent开发工程师路线图.md'), slug: 'agent-roadmap' })

  // ── backend：Week1–2 有日课，Week3–5 只有周计划 ──
  day = 0
  for (const { week, name } of weekDirs(BACKEND_SRC)) {
    const dir = join(BACKEND_SRC, name)
    for (const file of dayFiles(dir)) {
      day += 1
      plan.push({ course: 'backend', kind: 'day', week, day, file })
    }
    plan.push({ course: 'backend', kind: 'reference', week, day: week, file: join(dir, 'README.md'), slug: `week-${week}-plan` })
  }
  plan.push({ course: 'backend', kind: 'reference', day: 0, week: 0, file: join(BACKEND_SRC, 'README.md'), slug: 'overview' })

  return plan
}

function cleanTitle(text) {
  return stripInlineEmoji(text)
    .replace(/^Day\s*\d+\s*[｜|:：]\s*/, '')
    .replace(/^Week\s*\d+\s*[｜|:：]\s*/, '')
    .trim()
}

function firstParagraph(blocks) {
  let quote = null
  for (const b of blocks) {
    if (b.kind === 'blank') continue
    if (b.kind === 'heading') break
    if (b.kind === 'text' && /^>/.test(b.raw)) {
      if (!quote) quote = b.raw.replace(/^\s*>\s?/, '').trim()
      continue
    }
    if (b.kind === 'text' && b.text) return b.text
  }
  return quote || ''
}

function truncateLead(text, max = 110) {
  const clean = stripInlineEmoji(text).trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const stop = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('；'), cut.lastIndexOf('，'))
  return (stop > 40 ? cut.slice(0, stop + 1) : cut) + '……'
}

// ============================================================
// import
// ============================================================
function main() {
  if (!existsSync(DEVTOOL_SRC) || !existsSync(ML_SRC)) {
    console.error(`Tutorial source not found:\n  devtool: ${DEVTOOL_SRC}\n  ml: ${ML_SRC}`)
    console.error('Usage: node scripts/import-tutorials.mjs <教程1> <教程>')
    process.exit(1)
  }

  const plan = buildPlan()

  // Link map: absolute source path (lowercased, forward slashes) -> site URL.
  const bySource = new Map()
  for (const item of plan) {
    const slug = item.slug || `day-${pad2(item.day)}`
    const url = item.course === 'devtool' ? `/learn/devtool/${slug}`
      : item.course === 'ml' ? `/learn/ml/${slug}`
      : `/learn/backend/${slug}`
    bySource.set(resolve(item.file).replace(/\\/g, '/').toLowerCase(), url)
  }

  const warnings = []
  let deadLinks = 0
  let liveLinks = 0
  const perCourse = new Map()

  for (const item of plan) {
    const raw = readFileSync(item.file, 'utf8').replace(/\r\n/g, '\n')
    const tagged = tagFences(raw.split('\n'))
    const blocks = tagged.map((t, index) => ({ ...classify(t.line), raw: t.line, inFence: t.inFence, index }))
    const h1 = blocks.find((b) => b.kind === 'heading' && b.depth === 1 && !b.inFence)
    const h1Line = raw.match(/^#\s+(.+)$/m)?.[1]

    if (!h1 || !h1Line) {
      warnings.push(`${basename(item.file)}: no H1, skipped`)
      continue
    }
    const title = cleanTitle(h1Line)
    if (!title) {
      warnings.push(`${basename(item.file)}: empty H1, skipped`)
      continue
    }

    const slug = item.slug || `day-${pad2(item.day)}`
    const lead = truncateLead(firstParagraph(blocks.slice(blocks.indexOf(h1) + 1)))

    // Links resolve against this file's own directory, exactly as the
    // filesystem would.
    const baseDir = dirname(item.file)
    const resolveTarget = (target) => {
      try {
        const key = resolve(baseDir, decodeURIComponent(target)).replace(/\\/g, '/').toLowerCase()
        return bySource.get(key) ?? null
      } catch {
        return bySource.get(resolve(baseDir, target).replace(/\\/g, '/').toLowerCase()) ?? null
      }
    }

    const rendered = []
    let prevBlank = true
    for (const { line, inFence, isMathLine } of tagged.slice(h1.index + 1)) {
      let value
      if (inFence && !isMathLine) {
        // Code is copied byte-for-byte: the emoji guard exempts fences, and
        // reformatting example code would teach the wrong thing.
        value = line
      } else if (isMathLine) {
        // Display math keeps everything but emoji: escaping inside KaTeX
        // source would corrupt the formula.
        value = line.replace(EMOJI, '')
      } else if (line.trim()) {
        const linksBefore = (line.match(/\]\((?!#|https?:|mailto:)[^)]*\)/g) || []).length
        value = transformLine(line, resolveTarget)
        const kept = (value.match(/\]\(\/learn\//g) || []).length
        liveLinks += kept
        deadLinks += Math.max(0, linksBefore - kept)
      } else {
        value = line
      }

      if (!value.trim()) {
        if (!prevBlank) rendered.push('')
        prevBlank = true
        continue
      }
      rendered.push(value.replace(/\s+$/, ''))
      prevBlank = false
    }

    const weeks = item.course === 'devtool' ? DEVTOOL_WEEKS : item.course === 'ml' ? ML_WEEKS : BACKEND_WEEKS
    const meta = weeks[item.week] || { title: `第 ${item.week} 周`, blurb: '' }
    const fm = [
      `slug: ${slug}`,
      `kind: ${item.kind}`,
      `day: ${item.day}`,
      `week: ${item.week}`,
      `weekTitle: ${yamlQuote(meta.title)}`,
      `weekBlurb: ${yamlQuote(meta.blurb)}`,
      `title: ${yamlQuote(title)}`,
      lead ? `lead: ${yamlQuote(lead)}` : null,
      `sourcePath: ${yamlQuote(relative(item.course === 'devtool' ? DEVTOOL_SRC : ML_SRC, item.file).replace(/\\/g, '/'))}`,
    ].filter(Boolean)

    const outDir = join(OUT_ROOT, item.course)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(
      join(outDir, `${slug}.mdx`),
      `---\n${fm.join('\n')}\n---\n\n${rendered.join('\n').replace(/\n{3,}/g, '\n\n')}\n`,
      'utf8',
    )

    const bucket = perCourse.get(item.course) || { days: 0, refs: 0 }
    if (item.kind === 'day') bucket.days += 1
    else bucket.refs += 1
    perCourse.set(item.course, bucket)
  }

  for (const [course, { days, refs }] of perCourse) {
    console.log(`${course}: ${days} days + ${refs} references -> content/curriculum/${course}`)
  }
  console.log(`links: ${liveLinks} rewritten to /learn/*, ${deadLinks} dead links dropped to plain text`)
  if (warnings.length) {
    console.log('\nwarnings:')
    for (const w of warnings) console.log('  -', w)
  }
}

main()
