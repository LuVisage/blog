'use client'

import { useMemo, useState } from 'react'
import { KB_DOCS, KB_QUERIES } from '@/lib/sim/corpus'
import { cosine, hashVector, tokenContributions } from '@/lib/sim/text'
import { ControlRow, Pills, Range, ScoreBar, SimFrame, Stat, TextField } from './frame'

/** Day 11's mechanism: four ways to ask the same thing, real retrieval on each. */
const REWRITES = [
  { value: '怎么让模型别照着没有的东西瞎编', label: '原句 · 口语问法' },
  { value: '缓解大模型幻觉的方法', label: '术语改写' },
  { value: 'RAG 幻觉 知识库 检索增强 上下文', label: '关键词展开' },
  { value: 'RAG 先检索知识库再让模型基于片段作答，因此知识可更新、幻觉可缓解。', label: 'HyDE · 假设答案' },
]

export function VectorLab({ presets = false }: { presets?: boolean }) {
  const [query, setQuery] = useState(presets ? REWRITES[0].value : String(KB_QUERIES[0]))
  const [k, setK] = useState(3)
  const [open, setOpen] = useState<number | null>(null)

  const queryVector = useMemo(() => hashVector(query), [query])
  const ranked = useMemo(
    () =>
      KB_DOCS.map((doc, index) => ({
        index,
        doc,
        score: cosine(queryVector, hashVector(doc.text)),
      })).sort((a, b) => b.score - a.score),
    [queryVector]
  )
  const top = ranked[0]?.score || 1
  const hits = ranked.slice(0, k)
  const missed = ranked.slice(k)

  return (
    <SimFrame
      label="向量相似度实验台"
      hint={
        presets
          ? '同一个问题换四种问法，看排名第一的块和分数怎么变。这就是 Day 11 查询改写的全部动机。'
          : '改查询或改 k，排名和分数本地重算。分数是 cosine，条形按第一名归一化。'
      }
      source="向量 = 字符 n-gram 哈希词袋（96 维，本地实算）。课文用的是真 embedding 模型：它能把「瞎编」和「幻觉」拉近，词面向量不能——所以下面某些 0.00 分是模型差异，不是 bug。"
    >
      <div className="space-y-4">
        <ControlRow label="查询">
          <TextField value={query} onChange={setQuery} label="查询文本" placeholder="想知道什么，就打什么" />
        </ControlRow>
        <ControlRow label="k">
          <Range value={k} min={1} max={KB_DOCS.length} onChange={setK} />
        </ControlRow>
        <ControlRow label={presets ? '四种问法' : '示例查询'}>
          <Pills
            items={(presets ? REWRITES : KB_QUERIES.map((q) => ({ value: String(q), label: String(q) }))).slice()}
            active={query}
            onPick={setQuery}
          />
        </ControlRow>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
        <Stat label="语料块" value={`${KB_DOCS.length}`} />
        <Stat label="召回" value={`${hits.length}`} />
        <Stat label="第一名分数" value={top.toFixed(4)} />
        <Stat
          label="命中来源"
          value={hits.some((h) => h.score > 0.05) ? String(new Set(hits.filter((h) => h.score > 0.05).map((h) => h.doc.source)).size) + ' 个文件' : '无有效命中'}
        />
      </div>

      <ol className="mt-5 space-y-2.5">
        {hits.map((hit, rank) => (
          <li key={hit.doc.id} className="surface" style={{ borderRadius: 9 }}>
            <button
              type="button"
              onClick={() => setOpen(open === hit.index ? null : hit.index)}
              className="w-full text-left p-3.5"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="meta tabular-nums" style={{ color: 'var(--accent-text)' }}>
                  {String(rank + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
                  {hit.doc.heading}
                </span>
                <span className="eyebrow ml-auto flex-shrink-0" style={{ color: 'var(--muted)' }}>
                  {hit.doc.source}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <ScoreBar ratio={hit.score / top} />
                <span className="meta tabular-nums flex-shrink-0" style={{ color: 'var(--body)' }}>
                  {hit.score.toFixed(4)}
                </span>
              </div>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--body)' }}>
                {hit.doc.text}
              </p>
              <span className="eyebrow mt-2 inline-block" style={{ color: 'var(--muted)' }}>
                {open === hit.index ? '收起归因' : '为什么是这个分'}
              </span>
            </button>

            {open === hit.index && (
              <div className="px-3.5 pb-3.5" style={{ borderTop: '1px solid var(--line)' }}>
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {tokenContributions(query, hit.doc.text)
                    .slice(0, 8)
                    .map((term, i) => (
                      <span
                        key={`${term.term}-${i}`}
                        className="chip px-2 py-0.5 text-[11px] font-mono"
                        style={{
                          borderRadius: 6,
                          color: term.weight >= 0 ? 'var(--accent-text)' : 'var(--danger)',
                          borderColor: 'var(--line-faint)',
                        }}
                      >
                        {term.term} {term.weight >= 0 ? '+' : ''}
                        {term.weight.toFixed(3)}
                      </span>
                    ))}
                </div>
                <p className="body-sm mt-2.5" style={{ color: 'var(--muted)' }}>
                  只列出按贡献大小排的前 8 条，而且多个词会撞进同一个维度，所以它们加起来不等于上面的 cosine。正贡献来自字面重合，负贡献是哈希碰撞带来的噪声。真正的 embedding 不给这种解释，它给的是语义距离。
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>

      {missed.length > 0 && (
        <div className="mt-4">
          <div className="eyebrow mb-2">留在库里的 {missed.length} 块</div>
          <div className="flex flex-wrap gap-1.5">
            {missed.map((hit) => (
              <span key={hit.doc.id} className="chip px-2.5 py-1 text-xs" style={{ color: 'var(--muted)', borderRadius: 6 }}>
                {hit.doc.heading} · {hit.score.toFixed(3)}
              </span>
            ))}
          </div>
        </div>
      )}
    </SimFrame>
  )
}
