'use client'

import { useMemo, useState } from 'react'
import { MENU_DOCS, PARENT_DOCS } from '@/lib/sim/corpus'
import { cosine, hashVector } from '@/lib/sim/text'
import { ControlRow, Pills, ScoreBar, SimFrame, Stat, TextField } from './frame'

const CATEGORIES = [
  { value: 'none', label: '不限类目' },
  { value: '咖啡', label: 'category == 咖啡' },
  { value: '茶饮', label: 'category == 茶饮' },
]
const YEARS = [
  { value: 'none', label: '不限年份' },
  { value: '2025', label: 'year == 2025' },
  { value: '2024', label: 'year == 2024' },
]

function MatchRow({
  text,
  score,
  top,
  tag,
  dropped,
}: {
  text: string
  score: number
  top: number
  tag: string
  dropped?: boolean
}) {
  return (
    <li className="py-2.5 rule" style={{ opacity: dropped ? 0.45 : 1 }}>
      <div className="flex items-baseline gap-2">
        <span className="eyebrow" style={{ color: dropped ? 'var(--danger)' : 'var(--muted)' }}>
          {tag}
        </span>
        <span className="meta tabular-nums ml-auto" style={{ color: 'var(--body)' }}>
          {score.toFixed(4)}
        </span>
      </div>
      <p className="text-sm mt-1 leading-snug" style={{ color: 'var(--body)' }}>
        {text}
      </p>
      <div className="mt-1.5">
        <ScoreBar ratio={top ? score / top : 0} />
      </div>
    </li>
  )
}

/** Day 13 ①: the same retrieval with and without a metadata expression. */
function MetadataFilter() {
  const [query, setQuery] = useState('咖啡怎么做？')
  const [category, setCategory] = useState('none')
  const [year, setYear] = useState('none')

  const scored = useMemo(() => {
    const q = hashVector(query)
    return MENU_DOCS.map((doc, index) => ({ index, doc, score: cosine(q, hashVector(doc.text)) })).sort(
      (a, b) => b.score - a.score
    )
  }, [query])

  const expr = [
    category !== 'none' ? `category == "${category}"` : '',
    year !== 'none' ? `year == ${year}` : '',
  ]
    .filter(Boolean)
    .join(' and ')

  const kept = scored.filter((row) => (category === 'none' || row.doc.category === category) && (year === 'none' || String(row.doc.year) === year))
  const top = Math.max(scoredOrZero(scored), 0)
  const dropped = scored.filter((row) => !kept.includes(row))

  return (
    <>
      <div className="space-y-4">
        <ControlRow label="查询">
          <TextField value={query} onChange={setQuery} label="查询文本" />
        </ControlRow>
        <ControlRow label="过滤条件">
          <div className="space-y-2">
            <Pills items={CATEGORIES} active={category} onPick={setCategory} />
            <Pills items={YEARS} active={year} onPick={setYear} />
          </div>
        </ControlRow>
      </div>

      <div
        className="mt-5 px-3 py-2 text-xs font-mono"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 7, color: 'var(--accent-text)' }}
      >
        expr = {expr || '""（不过滤）'}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="surface p-3.5" style={{ borderRadius: 9 }}>
          <div className="eyebrow mb-1">不过滤</div>
          <ul>
            {scored.map((row) => (
              <MatchRow
                key={row.index}
                text={row.doc.text}
                score={row.score}
                top={top}
                tag={row.doc.category}
                dropped={!kept.includes(row)}
              />
            ))}
          </ul>
        </div>
        <div className="surface p-3.5" style={{ borderRadius: 9 }}>
          <div className="eyebrow mb-1">过滤后</div>
          {kept.length ? (
            <ul>
              {kept.map((row) => (
                <MatchRow key={row.index} text={row.doc.text} score={row.score} top={top} tag={row.doc.category} />
              ))}
            </ul>
          ) : (
            <p className="body-sm py-3" style={{ color: 'var(--muted)' }}>
              零命中。真实系统里这是最常见的事故：过滤条件写死之后，检索返回空列表，模型开始自由发挥。
            </p>
          )}
          {dropped.length > 0 && (
            <p className="body-sm mt-2" style={{ color: 'var(--muted)' }}>
              被条件挡掉 {dropped.length} 条：
              {dropped.map((row) => `「${row.doc.text.slice(0, 6)}…」`).join('')}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

function scoredOrZero(rows: { score: number }[]) {
  return rows.length ? Math.max(...rows.map((r) => r.score)) : 0
}

/** Day 13 ②: hit on a child sentence, return the whole parent section. */
function ParentDocument() {
  const [query, setQuery] = useState('闷蒸要等多久')
  const [mode, setMode] = useState<'child' | 'parent'>('child')

  const children = useMemo(
    () =>
      PARENT_DOCS.flatMap((parent, parentIndex) =>
        parent.children.map((child, childIndex) => ({ parentIndex, childIndex, parent, child }))
      ),
    []
  )

  const ranked = useMemo(() => {
    const q = hashVector(query)
    return children
      .map((entry) => ({ ...entry, score: cosine(q, hashVector(entry.child.text)) }))
      .sort((a, b) => b.score - a.score)
  }, [children, query])

  const hits = ranked.slice(0, 3)
  const parentOrder = [...new Map(hits.map((hit) => [hit.parentIndex, hit.parent.parent])).values()]
  const top = Math.max(...ranked.map((r) => r.score), 0)
  const contextText =
    mode === 'child'
      ? hits.map((hit) => hit.child.text).join('')
      : parentOrder
          .map((name) => PARENT_DOCS.find((item) => item.parent === name)!.children.map((c) => c.text).join(''))
          .join('')
  /** Join separators differ between the two renderings, so only count the characters a reader can point at. */
  const contextChars = [...contextText].filter((ch) => !/\s/.test(ch)).length

  return (
    <>
      <div className="space-y-4">
        <ControlRow label="查询">
          <TextField value={query} onChange={setQuery} label="查询文本" />
        </ControlRow>
        <ControlRow label="返回粒度">
          <Pills
            items={[
              { value: 'child', label: '返回子块（句子）' },
              { value: 'parent', label: '返回父块（整节）' },
            ]}
            active={mode}
            onPick={(value) => setMode(value as 'child' | 'parent')}
          />
        </ControlRow>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        <div className="surface p-3.5" style={{ borderRadius: 9 }}>
          <div className="eyebrow mb-2">索引层命中的子块</div>
          <ul>
            {hits.map((hit, rank) => (
              <MatchRow
                key={`${hit.parentIndex}-${hit.childIndex}`}
                text={`${hit.child.text}（${hit.child.year}）`}
                score={hit.score}
                top={top}
                tag={`${rank + 1} · ${hit.parent.parent}`}
              />
            ))}
          </ul>
        </div>
        <div className="surface p-3.5" style={{ borderRadius: 9 }}>
          <div className="eyebrow mb-2">交给模型的上下文</div>
          {mode === 'child'
            ? hits.map((hit) => (
                <p key={`${hit.parentIndex}c-${hit.childIndex}`} className="text-sm py-2 rule" style={{ color: 'var(--body)' }}>
                  {hit.child.text}
                </p>
              ))
            : parentOrder.map((parent) => {
                const source = PARENT_DOCS.find((item) => item.parent === parent)!
                return (
                  <div key={parent} className="py-2.5 rule">
                    <div className="eyebrow mb-1" style={{ color: 'var(--accent-text)' }}>
                      {parent} · 整节
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--body)' }}>
                      {source.children.map((child) => child.text).join(' ')}
                    </p>
                  </div>
                )
              })}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
        <Stat label="命中子块" value={`${hits.length} 条`} />
        <Stat label="去重后父块" value={`${parentOrder.length} 节`} />
        <Stat label="上下文字数（不含空格）" value={`${contextChars} 字`} />
      </div>
      <p className="body-sm mt-2.5" style={{ color: 'var(--muted)' }}>
        切细是为了召回准，返回粗是为了上下文全——父子文档就是把这两件事拆开做。
      </p>
    </>
  )
}

export function FilterLab({ mode }: { mode: 'metadata' | 'parent' }) {
  return (
    <SimFrame
      label={mode === 'metadata' ? '元数据过滤对照台' : '父子文档检索台'}
      hint={
        mode === 'metadata'
          ? '「咖啡味奶茶」和「美式咖啡」字面只差几个字，语义也近，但类目不同。加上过滤条件，看哪几条被挡住。'
          : '索引的是句子，回答需要整节。切换返回粒度，比较交给模型的上下文。'
      }
      source={
        mode === 'metadata'
          ? '四条菜单原文抄自 day13_metadata.py；相似度用本地词面向量算，课文用真 embedding——排序可能不同，被过滤掉的是同几条只看类目。'
          : '父子结构取自 day13_parent_doc.py 的思路，语料为演示数据；去重与字数统计在浏览器实算。'
      }
    >
      {mode === 'metadata' ? <MetadataFilter /> : <ParentDocument />}
    </SimFrame>
  )
}
