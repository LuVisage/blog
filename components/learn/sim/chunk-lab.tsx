'use client'

import { useMemo, useState } from 'react'
import { CHUNK_SAMPLE } from '@/lib/sim/corpus'
import { splitText, DEFAULT_SEPARATORS, PLAIN_SEPARATORS } from '@/lib/sim/chunk'
import { ControlRow, Pills, Range, SimFrame, Stat } from './frame'

const SEPARATOR_SETS = [
  { value: 'default', label: '默认：段落 → 换行 → 空格 → 字符', list: PLAIN_SEPARATORS },
  { value: 'cn', label: '中文：再加句号、叹号、问号、逗号', list: DEFAULT_SEPARATORS },
]

/** The three knobs day06_chunking.py turns, packed as `size:overlap:separators`. */
const PRESETS = [
  { value: '100:0:default', label: '课文 ①' },
  { value: '100:30:cn', label: '课文 ②' },
  { value: '250:30:default', label: '课文 ③' },
  { value: '40:0:default', label: '40/0 腰斩' },
  { value: '80:40:cn', label: '80/40 整句进下一块' },
]

/** Sentences no single chunk contains whole — the cuts this run actually made. */
function findBrokenSentences(text: string, chunks: string[]) {
  const sentences = text
    .split(/(?<=[。！？\n])/)
    .map((s) => s.trim())
    .filter((s) => [...s].length >= 12)
  return sentences.filter((sentence) => !chunks.some((chunk) => chunk.includes(sentence)))
}

/** The first chunk_size that keeps every sentence whole at these separators. */
function smallestWholeSize(text: string, overlap: number, separators: string[]) {
  const longest = text
    .split(/(?<=[。！？\n])/)
    .map((s) => s.trim())
    .reduce((max, s) => Math.max(max, [...s].length), 0)
  for (let size = longest; size <= [...text].length + 20; size++) {
    const chunks = splitText(text, { chunkSize: size, overlap, separators })
    if (!findBrokenSentences(text, chunks).length) return size
  }
  return null
}

/**
 * Longest run that ends one chunk and opens the next. Purely observational: this
 * sample repeats 向量数据库 across a line break, so shared text is not by itself
 * proof that overlap carried it — drag overlap and watch the number to see that.
 */
function sharedRun(prev: string, next: string) {
  const a = [...prev]
  const b = [...next]
  for (let n = Math.min(a.length, b.length); n > 0; n--) {
    if (a.slice(-n).join('') === b.slice(0, n).join('')) return b.slice(0, n).join('')
  }
  return ''
}

export function ChunkLab() {
  const [size, setSize] = useState(100)
  const [overlap, setOverlap] = useState(0)
  const [separatorSet, setSeparatorSet] = useState('default')

  const separators = (SEPARATOR_SETS.find((s) => s.value === separatorSet) || SEPARATOR_SETS[0]).list
  const chunks = useMemo(
    () => splitText(CHUNK_SAMPLE, { chunkSize: size, overlap, separators: [...separators] }),
    [size, overlap, separators]
  )
  const broken = useMemo(() => findBrokenSentences(CHUNK_SAMPLE, chunks), [chunks])
  const longestBroken = broken.reduce((max, sentence) => Math.max(max, [...sentence].length), 0)
  const needed = useMemo(
    () => (broken.length ? smallestWholeSize(CHUNK_SAMPLE, overlap, [...separators]) : null),
    [broken.length, overlap, separators]
  )
  const lengths = chunks.map((c) => [...c].length)
  const average = lengths.length ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : 0

  /* What the lesson's three configurations really return on this 218-字 sample. */
  const reference = useMemo(() => {
    const run = (chunkSize: number, chunkOverlap: number, list: string[]) =>
      splitText(CHUNK_SAMPLE, { chunkSize, overlap: chunkOverlap, separators: list }).map((c) => [...c].length)
    const lesson1 = run(100, 0, [...PLAIN_SEPARATORS])
    const lesson2 = run(100, 30, [...DEFAULT_SEPARATORS])
    const lesson3 = run(250, 30, [...PLAIN_SEPARATORS])
    return { lesson1, lesson2, lesson3, identical: lesson1.join('-') === lesson2.join('-') }
  }, [])
  /* ① and ② emit identical chunks, so only the parameter triple says which one this is. */
  const presetName = PRESETS.find((preset) => preset.value === `${size}:${overlap}:${separatorSet}`)?.label

  /* Duplicated characters across chunk boundaries — overlap's visible residue. */
  const sharedTotal = chunks
    .slice(1)
    .reduce((sum, chunk, index) => sum + [...sharedRun(chunks[index], chunk)].length, 0)

  return (
    <SimFrame
      label="切分实验台"
      hint="课文说这里有三个旋钮：chunk_size 决定一块多大，overlap 决定相邻两块往回拽多少，separators 决定先从哪里下刀。三个都能拖，块数、块长和被切断的整句立刻重算 —— 先提醒两句：这份样例只有 218 字，多数参数组合下只有 chunk_size 真的在动；而「与上一块重复」数的是相邻两块共有的字，overlap=0 时它也可能不为 0，因为原文自己就把「向量数据库」重复了一遍。"
      source="切分逻辑是 lib/sim/chunk.ts 对 RecursiveCharacterTextSplitter 的移植，逐字对齐本机安装的 langchain_text_splitters（含 keep_separator=True）；语料是 day06_chunking.py 里的 sample 原文。"
    >
      <div className="space-y-4">
        <ControlRow label="chunk_size">
          <Range value={size} min={40} max={240} step={10} onChange={setSize} />
        </ControlRow>
        <ControlRow label="overlap">
          <Range value={overlap} min={0} max={Math.max(0, size - 20)} step={5} onChange={setOverlap} />
        </ControlRow>
        <ControlRow label="separators">
          <Pills items={SEPARATOR_SETS} active={separatorSet} onPick={setSeparatorSet} />
        </ControlRow>
        <ControlRow label="参数预设">
          <Pills
            items={PRESETS}
            active={`${size}:${overlap}:${separatorSet}`}
            onPick={(value) => {
              const [a, b, c] = value.split(':')
              setSize(Number(a))
              setOverlap(Number(b))
              setSeparatorSet(c)
            }}
          />
        </ControlRow>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
        <Stat label="块数" value={String(chunks.length)} />
        <Stat label="平均块长" value={`${average} 字`} />
        <Stat label="最长块" value={`${lengths.length ? Math.max(...lengths) : 0} 字`} />
        <Stat label="被切断的整句" value={`${broken.length} 句`} />
        <Stat label="与上一块重复" value={`${sharedTotal} 字`} />
      </div>

      <ol className="mt-5 space-y-3">
        {chunks.map((chunk, i) => {
          const shared = i > 0 ? sharedRun(chunks[i - 1], chunk) : ''
          return (
            <li key={i} className="surface p-3.5" style={{ borderRadius: 9 }}>
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="meta tabular-nums" style={{ color: 'var(--accent-text)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="eyebrow">{[...chunk].length} 字</span>
                {shared && (
                  <span className="eyebrow ml-auto" style={{ color: 'var(--muted)' }}>
                    与上一块共有 {[...shared].length} 字
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--body)' }}>
                {shared && chunk.startsWith(shared) ? (
                  <>
                    <span style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)' }}>{shared}</span>
                    {chunk.slice(shared.length)}
                  </>
                ) : (
                  chunk
                )}
              </p>
            </li>
          )
        })}
      </ol>

      <div
        className="mt-5 p-4"
        style={{ border: '1px solid var(--line-strong)', borderRadius: 8 }}
      >
        <div className="eyebrow mb-2" style={{ color: 'var(--muted)' }}>
          课文三组参数的真实输出
        </div>
        <ul className="space-y-1">
          {[
            { name: '①', args: 'chunk=100 · overlap=0 · 默认分隔符', run: reference.lesson1 },
            { name: '②', args: 'chunk=100 · overlap=30 · 中文分隔符', run: reference.lesson2 },
            { name: '③', args: 'chunk=250 · overlap=30 · 默认分隔符', run: reference.lesson3 },
          ].map((row) => (
            <li key={row.name} className="flex flex-wrap items-baseline gap-x-2 text-sm">
              <span className="meta" style={{ color: 'var(--accent-text)' }}>
                {row.name}
              </span>
              <span className="caption" style={{ color: 'var(--muted)' }}>
                {row.args}
              </span>
              <span className="meta tabular-nums ml-auto" style={{ color: 'var(--ink)' }}>
                {row.run.join(' · ')}
              </span>
            </li>
          ))}
        </ul>
        <p className="body-sm mt-2.5" style={{ color: 'var(--muted)' }}>
          {reference.identical
            ? '① 和 ② 一字不差 —— 课文写「① 可能把『近似最近邻搜索』切成两半」，在这份 218 字样例上 chunk_size=100 复现不出来。拖到 40/0 才会看到句子被切断，而切点是 Top-K | 结果。 这样的空格边界，那个词组本身始终完整。'
            : '① 与 ② 的输出这次并不相同，逐块长度见上。'}
          {presetName ? `当前这一组就是「${presetName}」。` : '当前这组参数是你在拖三个旋钮拖出来的。'}
        </p>
      </div>

      {broken.length > 0 && (
        <div
          className="mt-5 p-4"
          style={{ border: '1px solid var(--line-strong)', borderLeft: '2px solid var(--gold)', borderRadius: 8 }}
        >
          <div className="eyebrow mb-2" style={{ color: 'var(--gold)' }}>
            这些整句没有完整落在任何一块里
          </div>
          <ul className="space-y-1.5">
            {broken.slice(0, 4).map((sentence, i) => (
              <li key={i} className="text-sm" style={{ color: 'var(--body)' }}>
                {sentence}
              </li>
            ))}
          </ul>
          <p className="body-sm mt-2.5" style={{ color: 'var(--muted)' }}>
            最长的一句 {longestBroken} 字，而一块最多装 {size} 字，所以切断是必然的：overlap
            只是把上一块的整块搬进下一块开头，装不下的还是装不下。当前这套分隔符下，把 chunk_size 提到{' '}
            {needed === null ? '这份样例的长度以上' : `${needed} 以上`}
            才会一栏清零。课文里那条「段落 → 换行 → 句号 → 最后才按字符」的优先级，和速查表里「中文文档把
            chunk_size 适当调大」那条坑，说的都是这一件事。
          </p>
        </div>
      )}
    </SimFrame>
  )
}
