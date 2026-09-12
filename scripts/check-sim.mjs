/**
 * Cross-checks the browser-side models against the libraries the tutorial uses.
 *
 *   node scripts/check-sim.mjs
 *
 * The chunker is a hand port of RecursiveCharacterTextSplitter, so its output is
 * compared with the real Python class on the lesson's own sample text. The hybrid
 * lab is checked against the RRF formula day-12 ships. Exits non-zero when a
 * model stops agreeing with the reference.
 */
import { writeFileSync, mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { execFileSync } from 'child_process'

const ts = await import('../lib/sim/chunk.ts')
const text = await import('../lib/sim/text.ts')
const corpus = await import('../lib/sim/corpus.ts')

const SAMPLE = corpus.CHUNK_SAMPLE
const chars = (value) => [...value].length
const CN = ts.DEFAULT_SEPARATORS
const PLAIN = ts.PLAIN_SEPARATORS

/** The three configurations day06_chunking.py actually runs, plus a sweep. */
const CASES = [
  { label: '课文①', size: 100, overlap: 0, separators: PLAIN },
  { label: '课文②', size: 100, overlap: 30, separators: CN },
  { label: '课文③', size: 250, overlap: 30, separators: PLAIN },
  { label: '扫描', size: 40, overlap: 0, separators: CN },
  { label: '扫描', size: 60, overlap: 30, separators: CN },
  { label: '扫描', size: 80, overlap: 0, separators: CN },
  { label: '扫描', size: 150, overlap: 20, separators: CN },
  { label: '扫描', size: 240, overlap: 60, separators: CN },
  { label: '扫描', size: 45, overlap: 15, separators: PLAIN },
]

const failures = []
const check = (name, ok, detail) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures.push(name)
}

/* ---------- 1. chunker vs. langchain ---------- */

const dir = mkdtempSync(join(tmpdir(), 'simcheck-'))
const inPath = join(dir, 'in.json')
const pyPath = join(dir, 'split.py')
writeFileSync(
  inPath,
  JSON.stringify({ text: SAMPLE, cases: CASES })
)
writeFileSync(
  pyPath,
  [
    'import json, sys',
    'from langchain_text_splitters import RecursiveCharacterTextSplitter',
    'data = json.load(open(sys.argv[1], encoding="utf-8"))',
    'out = []',
    'for case in data["cases"]:',
    '    splitter = RecursiveCharacterTextSplitter(',
    '        chunk_size=case["size"], chunk_overlap=case["overlap"], separators=case["separators"]',
    '    )',
    '    out.append({**case, "chunks": splitter.split_text(data["text"])})',
    'print(json.dumps(out, ensure_ascii=False))',
  ].join('\n')
)

let reference = null
try {
  reference = JSON.parse(execFileSync('python', [pyPath, inPath], { encoding: 'utf8' }))
} catch (error) {
  const detail = (error.stderr || error.message || '').toString().trim()
  // 本机没装 python 可以跳过；CI 上跳过等于这项对照从未跑过，不能算通过。
  if (process.env.CI === 'true') check('langchain 参照可用', false, detail.split('\n')[0])
  else console.log(`SKIP  langchain 对照 — 本机 python 不可用\n${detail.slice(0, 200)}`)
}

if (reference) {
  for (const row of reference) {
    const mine = ts.splitText(SAMPLE, { chunkSize: row.size, overlap: row.overlap, separators: row.separators })
    const tag = `${row.label} ${row.size}/${row.overlap}`
    check(
      `chunk ${tag} 与 langchain 逐字一致`,
      mine.join('\u0000') === row.chunks.join('\u0000'),
      mine.join('\u0000') === row.chunks.join('\u0000')
        ? `${mine.length} 块`
        : `js=[${mine.map((c) => chars(c))}] py=[${row.chunks.map((c) => [...c].length)}]`
    )
  }
}
rmSync(dir, { recursive: true, force: true })

/* ---------- 2. the chunker's own invariants ---------- */

const strip = (value) => value.replace(/\s/g, '')

/** Longest run that ends one chunk and opens the next — the overlap's residue. */
function repeated(prev, next) {
  const a = [...prev]
  const b = [...next]
  for (let n = Math.min(a.length, b.length); n > 0; n--) {
    if (a.slice(-n).join('') === b.slice(0, n).join('')) return { text: b.slice(0, n).join(''), at: a.length - n }
  }
  return { text: '', at: a.length }
}

for (const size of [40, 100, 240]) {
  for (const overlap of [0, Math.round(size * 0.3)]) {
    for (const [name, separators] of [
      ['中文分隔符', ts.DEFAULT_SEPARATORS],
      ['默认分隔符', ts.PLAIN_SEPARATORS],
    ]) {
      const chunks = ts.splitText(SAMPLE, { chunkSize: size, overlap, separators })
      const tooLong = chunks.filter((c) => chars(c) > size).map((c) => chars(c))
      check(`${name} ${size}/${overlap} 没有块超过 chunk_size`, tooLong.length === 0, tooLong.join(','))

      /* keep_separator glues each separator to the piece after it, so a chunk can only
         ever be a contiguous slice of the source — nothing gets reworded or dropped. */
      const covered = new Array(chars(SAMPLE)).fill(false)
      const foreign = chunks.filter((chunk) => {
        let at = SAMPLE.indexOf(chunk)
        if (at === -1) return true
        for (; at !== -1; at = SAMPLE.indexOf(chunk, at + 1)) {
          for (let i = at; i < at + chars(chunk); i++) covered[i] = true
        }
        return false
      })
      check(
        `${name} ${size}/${overlap} 每个块都是原文的连续片段`,
        foreign.length === 0,
        foreign.length ? JSON.stringify(foreign[0]) : ''
      )
      const gaps = [...SAMPLE]
        .filter((ch, index) => strip(ch) && !covered[index])
        .join('')
      check(`${name} ${size}/${overlap} 正文不丢字`, gaps === '', gaps ? `漏掉 ${JSON.stringify(gaps)}` : '')
    }
  }
}

/* Overlap pops whole pieces off the front, so whatever two adjacent chunks share must
   begin right after a separator. A port that slices the previous chunk by character
   breaks mid-word instead — which is the bug this check exists to catch. */
let repetitions = 0
const misplaced = []
for (const [size, overlap] of [
  [40, 12],
  [80, 40],
  [45, 15],
  [240, 200],
]) {
  for (const separators of [ts.DEFAULT_SEPARATORS, ts.PLAIN_SEPARATORS]) {
    const chunks = ts.splitText(SAMPLE, { chunkSize: size, overlap, separators })
    chunks.slice(1).forEach((chunk, index) => {
      const { text, at } = repeated(chunks[index], chunk)
      if (!text) return
      repetitions += 1
      const before = [...chunks[index]][at - 1]
      if (before !== undefined && !/\s|[。！？，]/.test(before)) {
        misplaced.push(`${size}/${overlap} → ${JSON.stringify(text)}`)
      }
    })
  }
}
check('overlap 搬运整块而不是半句', misplaced.length === 0, misplaced.join('、'))
check('样例上确实出现过整块重叠，不是空断言', repetitions > 0, `${repetitions} 处`)

/* ---------- 3. hybrid lab vs. the RRF formula in day-12 ---------- */

const bm25 = text.buildBm25(corpus.HYBRID_DOCS.map((d) => d.text))
for (const preset of corpus.HYBRID_QUERIES) {
  const queryVector = text.normalize(preset.vector)
  const vectorRank = corpus.HYBRID_DOCS.map((doc, index) => ({ index, score: text.cosine(queryVector, doc.vector) }))
    .sort((a, b) => b.score - a.score)
    .map((row) => row.index)
  const lexicalRank = bm25.search(preset.query).map((row) => row.index)
  const fused = text.rrf([vectorRank, lexicalRank])

  /* RRFRanker(60): score(rank) = 1/(60+rank+1), so a doc in both lists beats one in only one. */
  const inBoth = fused.filter((row) => row.votes.length === 2).map((row) => row.index)
  const handRanked = fused.map((row) => {
    const rank = (list) => list.indexOf(row.index)
    return 1 / (60 + rank(vectorRank) + 1) + 1 / (60 + rank(lexicalRank) + 1)
  })
  check(
    `RRF ${preset.label} 与手算 1/(60+rank+1) 一致`,
    fused.every((row, i) => Math.abs(row.score - handRanked[i]) < 1e-12)
  )
  check(
    `RRF ${preset.label} 第一名至少出现在一路的前二`,
    inBoth.includes(fused[0].index) || vectorRank.slice(0, 2).includes(fused[0].index) || lexicalRank.slice(0, 2).includes(fused[0].index),
    `fusion=${fused.map((r) => r.index)} vector=${vectorRank} bm25=${lexicalRank}`
  )
}

/* ---------- 4. token estimate ---------- */

const mixed = text.estimateTokens('向量数据库 vector database 混合检索 hybrid search')
check('token 估计落在合理区间', mixed > 8 && mixed < 40, String(mixed))
check('空文本估 0', text.estimateTokens('') === 0)

console.log(failures.length ? `\n${failures.length} 项不通过：${failures.join('、')}` : '\n全部通过')
process.exit(failures.length ? 1 : 0)
