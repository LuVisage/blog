'use client'

import { useMemo, useState } from 'react'
import { HYBRID_DOCS, HYBRID_QUERIES } from '@/lib/sim/corpus'
import { buildBm25, cosine, normalize, rrf } from '@/lib/sim/text'
import { ControlRow, Pills, SimFrame } from './frame'

const TEXTS = HYBRID_DOCS.map((doc) => doc.text)
const BM25 = buildBm25(TEXTS)

interface Column {
  title: string
  caption: string
  order: { index: number; score: number }[]
  format: (score: number) => string
}

function RankColumn({ column, vectorRank }: { column: Column; vectorRank?: Map<number, number> }) {
  return (
    <div className="surface p-3.5" style={{ borderRadius: 9 }}>
      <div className="heading-3 text-sm" style={{ color: 'var(--ink)' }}>
        {column.title}
      </div>
      <p className="meta mt-1 mb-3" style={{ color: 'var(--muted)' }}>
        {column.caption}
      </p>
      <ol className="space-y-2.5">
        {column.order.map((row, rank) => {
          const doc = HYBRID_DOCS[row.index]
          const move = vectorRank ? vectorRank.get(row.index)! - rank : 0
          return (
            <li key={doc.pk} style={{ opacity: row.score > 0 ? 1 : 0.42 }}>
              <div className="flex items-baseline gap-2">
                <span className="meta tabular-nums" style={{ color: 'var(--accent-text)' }}>
                  {rank + 1}
                </span>
                <span className="meta tabular-nums ml-auto flex-shrink-0" style={{ color: 'var(--body)' }}>
                  {column.format(row.score)}
                </span>
                {vectorRank && (
                  <span
                    className="meta tabular-nums flex-shrink-0"
                    style={{ color: move > 0 ? 'var(--success)' : move < 0 ? 'var(--danger)' : 'var(--muted)' }}
                  >
                    {move > 0 ? `↑${move}` : move < 0 ? `↓${-move}` : '—'}
                  </span>
                )}
              </div>
              <div className="text-sm mt-0.5 leading-snug" style={{ color: 'var(--body)' }}>
                #{doc.pk} {doc.text}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function HybridLab() {
  const [picked, setPicked] = useState<string>(HYBRID_QUERIES[0].label)
  const preset = HYBRID_QUERIES.find((item) => item.label === picked) ?? HYBRID_QUERIES[0]

  const { vectorColumn, bm25Column, fusionColumn, vectorRank } = useMemo(() => {
    const queryVector = normalize(preset.vector)
    const vectorOrder = HYBRID_DOCS.map((doc, index) => ({
      index,
      score: cosine(queryVector, normalize(doc.vector)),
    })).sort((a, b) => b.score - a.score)

    const bm25Order = BM25.search(preset.query).filter((row) => row.score > 0)

    const rank = new Map(vectorOrder.map((row, index) => [row.index, index]))
    const fused = rrf([vectorOrder.map((r) => r.index), bm25Order.map((r) => r.index)], 60)

    return {
      vectorColumn: {
        title: '纯向量',
        caption: `cosine · 查询向量 [${preset.vector.join(', ')}]（课文手写维度，只为看排名）`,
        order: vectorOrder,
        format: (score: number) => score.toFixed(4),
      } as Column,
      bm25Column: {
        title: '纯 BM25',
        caption: 'k1=1.2 b=0.75 · 只看词面命中，稀有词权重高',
        order: bm25Order,
        format: (score: number) => score.toFixed(3),
      } as Column,
      fusionColumn: {
        title: '混合 · RRF',
        caption: '1/(60+名次) 相加 · 只认名次不认分数，两路都在前的赢',
        order: fused.map((row) => ({ index: row.index, score: row.score })),
        format: (score: number) => score.toFixed(5),
      } as Column,
      vectorRank: rank,
    }
  }, [preset])

  const spread = vectorColumn.order.slice(0, 2).map((row) => row.score)
  const gap = spread.length > 1 ? Math.abs(spread[0] - spread[1]) : 0
  const topTwo = vectorColumn.order.slice(0, 2).map((row) => HYBRID_DOCS[row.index].pk)
  const moved = fusionColumn.order.filter((row, rank) => vectorRank.get(row.index) !== rank).length

  return (
    <SimFrame
      label="向量 / BM25 / RRF 对照台"
      hint="同一查询走三条路：向量给语义距离，BM25 给字面命中，RRF 只看两边名次再融合。这里两条路的意见恰好一致，所以 ↑↓ 全是 ——，融合列就是向量列的顺序。课文 12.1 说的「精确词盲区」需要两路打架，而 4 维手写向量造不出那个分歧。"
      source="语料和 4 维向量来自 day12_hybrid.py 原文；BM25 与 RRF(60) 在浏览器实算，分词规则与 Milvus 的 jieba 分析器不同，字面分可能与 Python 略有出入。"
    >
      <ControlRow label="查询">
        <Pills
          items={HYBRID_QUERIES.map((item) => ({ value: item.label, label: `${item.label}` }))}
          active={picked}
          onPick={setPicked}
        />
      </ControlRow>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
        <RankColumn column={vectorColumn} />
        <RankColumn column={bm25Column} vectorRank={vectorRank} />
        <RankColumn column={fusionColumn} vectorRank={vectorRank} />
      </div>

      <p className="body-sm mt-4" style={{ color: 'var(--muted)' }}>
        {`实算结果：向量列把 #${topTwo[0]} 和 #${topTwo[1]} 拉开 ${gap.toFixed(4)}，${gap < 0.02 ? '这个差距小到单靠向量分不出高下' : '这个差距已经足够分清先后'}。BM25 命中 ${bm25Column.order.length} 条，融合列相对向量列有 ${moved} 行换了名次，第一名是 #${
          fusionColumn.order[0] ? HYBRID_DOCS[fusionColumn.order[0].index].pk : '—'
        }。`}
      </p>
    </SimFrame>
  )
}
