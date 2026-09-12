'use client'

import { useEffect, useMemo, useState } from 'react'
import { GRAPH_DAY16, GRAPH_DAY17, GRAPH_DAY18, GRAPH_DAY33, type GraphFixture, type GraphState } from '@/lib/sim/corpus'
import { runGraph, stateEntries, type GraphStep } from '@/lib/sim/graph'
import { SimFrame } from './frame'

const FIXTURES: Record<string, GraphFixture> = {
  day16: GRAPH_DAY16,
  day17: GRAPH_DAY17,
  day18: GRAPH_DAY18,
  day33: GRAPH_DAY33,
}

function StateTable({ state }: { state: GraphState }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-[minmax(0,110px)_minmax(0,1fr)] gap-x-4 gap-y-1 mt-2">
      {stateEntries(state).map(([key, value]) => (
        <div key={key} className="contents">
          <dt className="meta" style={{ color: 'var(--muted)' }}>
            {key}
          </dt>
          <dd className="text-xs leading-relaxed break-words" style={{ color: 'var(--body)', fontFamily: 'var(--font-mono)' }}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function GraphPlayer({ graph, checkpoint = false, label, hint }: { graph: string; checkpoint?: boolean; label: string; hint: string }) {
  const fixture = FIXTURES[graph] ?? GRAPH_DAY16
  const [cursor, setCursor] = useState(0)
  const [approved, setApproved] = useState<boolean | undefined>(undefined)
  const [resume, setResume] = useState<{ step: GraphStep; index: number } | null>(null)
  const [playing, setPlaying] = useState(false)

  const run = useMemo(
    () => runGraph(fixture, { approved, startFrom: resume?.step }),
    [fixture, approved, resume]
  )
  const total = run.steps.length
  const shown = Math.min(cursor, total)
  const currentStep = run.steps[shown - 1]
  /** The transition the player is standing in front of — for a paused graph it is the edge into interrupt(). */
  const frontier =
    run.status === 'paused'
      ? fixture.edges.filter((edge) => edge.to === run.pending)
      : currentStep?.branch && currentStep.branch !== '__end__'
        ? [{ from: currentStep.node, to: currentStep.branch }]
        : fixture.edges.filter((edge) => edge.from === (currentStep?.node ?? '__start__'))
  /** Only the edges leaving the router node are decided at run time; the rest are wired up front. */
  const routed = Boolean(fixture.router) && frontier.some((edge) => edge.from === fixture.router!.at)

  useEffect(() => {
    if (!playing) return
    if (shown >= total) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setCursor((value) => value + 1), 900)
    return () => clearTimeout(timer)
  }, [playing, shown, total])

  const reset = () => {
    setCursor(0)
    setPlaying(false)
    setApproved(undefined)
    setResume(null)
  }

  const paused = run.status === 'paused' ? run.pending : null

  return (
    <SimFrame
      label={label}
      hint={hint}
      tone={fixture.faithful ? 'local' : 'scripted'}
      source={
        fixture.faithful
          ? `${fixture.source}。节点函数在浏览器真实执行，状态变化逐步记录。`
          : `${fixture.source}。状态机在浏览器真实执行，但节点内容是为了讲清机制而写的演示代码。`
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setCursor((value) => Math.min(value + 1, total))
          }}
          disabled={shown >= total || !!paused}
          className="btn-secondary px-3 py-1.5 text-xs"
          style={{ color: 'var(--body)' }}
        >
          单步执行
        </button>
        <button
          type="button"
          onClick={() => {
            if (shown >= total) setCursor(0)
            setPlaying((value) => !value)
          }}
          disabled={Boolean(paused)}
          className="btn-secondary px-3 py-1.5 text-xs"
          style={{ color: 'var(--body)' }}
        >
          {playing ? '暂停' : '自动播放'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="btn-ghost px-3 py-1.5 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          重置
        </button>
        {resume && (
          <button
            type="button"
            onClick={() => {
              setResume(null)
              setCursor(0)
              setPlaying(false)
            }}
            className="chip px-2.5 py-1 text-[11px]"
            style={{ color: 'var(--accent-text)', borderColor: 'var(--accent-line)', borderRadius: 6 }}
          >
            检查点：第 {resume.index + 1} 步之后 · 回到最初
          </button>
        )}
        <span className="meta tabular-nums ml-auto" style={{ color: 'var(--muted)' }}>
          步 {shown}/{total || 0} · 上限 {fixture.limit}
        </span>
      </div>

      <div className="mt-4 px-3 py-2 text-xs font-mono overflow-x-auto" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 7, color: 'var(--muted)' }}>
        {fixture.edges.map((edge) => `${edge.from} → ${edge.to}`).join('   ')}
        {fixture.router && (
          <>
            {'   '}
            <span style={{ color: 'var(--accent-text)' }}>conditional({fixture.router.at})</span>
          </>
        )}
      </div>
      {fixture.router && (
        <p className="body-sm mt-2" style={{ color: 'var(--muted)' }}>
          条件边：{fixture.router.describe}
        </p>
      )}

      {shown < total || paused ? (
        <p className="body-sm mt-2" style={{ color: 'var(--muted)' }}>
          当前停在{' '}
          <span className="font-mono" style={{ color: 'var(--ink)' }}>
            {currentStep ? currentStep.node : '__start__'}
          </span>
          ，下一步走{' '}
          <span className="font-mono" style={{ color: 'var(--accent-text)' }}>
            {frontier.map((edge) => `${edge.from} → ${edge.to}`).join(' + ') || '（无路可走）'}
          </span>
          {routed ? ' —— 这条边由条件函数决定，上一个节点跑完才知道。' : ''}
        </p>
      ) : run.status === 'limit' ? (
        <p className="body-sm mt-2" style={{ color: 'var(--muted)' }}>
          图从没走到 <span className="font-mono" style={{ color: 'var(--ink)' }}>__end__</span>
          ，是步数上限把它掐断的。
        </p>
      ) : (
        <p className="body-sm mt-2" style={{ color: 'var(--muted)' }}>
          图已走到 <span className="font-mono" style={{ color: 'var(--ink)' }}>__end__</span>
          {run.status === 'done' && currentStep
            ? `，最后一步是 ${currentStep.node}。`
            : '。'}
        </p>
      )}

      {paused && (
        <div
          className="mt-4 p-4"
          style={{ border: '1px solid var(--line-strong)', borderLeft: '2px solid var(--gold)', borderRadius: 8 }}
        >
          <div className="eyebrow mb-2.5" style={{ color: 'var(--gold)' }}>
            图停在 {paused} —— 等待人工输入
          </div>
          <p className="body-sm mb-3" style={{ color: 'var(--muted)' }}>
            这一步对应 <code>interrupt()</code>：图把状态存下来就退出，直到有人 <code>Command(resume=...)</code>。选一个决定：
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setApproved(true)
                setCursor((value) => value + 1)
              }}
              className="btn-primary px-3 py-1.5 text-xs"
            >
              批准，继续
            </button>
            <button
              type="button"
              onClick={() => {
                setApproved(false)
                setCursor((value) => value + 1)
              }}
              className="btn-secondary px-3 py-1.5 text-xs"
              style={{ color: 'var(--body)' }}
            >
              驳回
            </button>
          </div>
        </div>
      )}

      {run.status === 'limit' && (
        <div
          className="mt-4 p-4"
          style={{ border: '1px solid var(--line-strong)', borderLeft: '2px solid var(--danger)', borderRadius: 8 }}
        >
          <div className="eyebrow" style={{ color: 'var(--danger)' }}>
            触发步数上限，图被强制停止
          </div>
          <p className="body-sm mt-1.5" style={{ color: 'var(--muted)' }}>
            课文里的现象是 <code>GraphRecursionError</code>：条件边永远不指向结束节点时，靠 <code>recursion_limit</code> 兜底。
          </p>
        </div>
      )}

      <ol className="mt-5 space-y-2.5">
        {run.steps.slice(0, shown).map((step, index) => {
          const active = index === shown - 1
          return (
            <li
              key={`${step.node}-${index}`}
              data-spotlight="row"
              className="p-3.5"
              style={{
                border: '1px solid ' + (active ? 'var(--accent-line)' : 'var(--line)'),
                borderLeft: `2px solid ${active ? 'var(--accent)' : 'var(--line-strong)'}`,
                borderRadius: 8,
                background: active ? 'var(--accent-soft)' : 'transparent',
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="meta tabular-nums" style={{ color: 'var(--accent-text)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
                  {step.node}
                </span>
                <span className="eyebrow">{step.summary}</span>
                {step.branch && step.branch !== '__end__' && (
                  <span className="chip px-2 py-0.5 text-[11px]" style={{ color: 'var(--accent-text)', borderColor: 'var(--accent-line)', borderRadius: 6 }}>
                    分支 → {step.branch}
                  </span>
                )}
                {checkpoint && (
                  <button
                    type="button"
                    onClick={() => {
                      setResume({ step, index })
                      setCursor(0)
                      setApproved(undefined)
                    }}
                    className="ml-auto text-xs underline underline-offset-4"
                    style={{ color: 'var(--muted)' }}
                  >
                    从这里续跑
                  </button>
                )}
              </div>
              <StateTable state={step.state} />
            </li>
          )
        })}
        {shown === 0 && (
          <li className="body-sm py-3" style={{ color: 'var(--muted)' }}>
            还没开始。点「单步执行」跑一个节点，或直接自动播放。
          </li>
        )}
      </ol>

      {shown >= total && total > 0 && run.status !== 'limit' && currentStep && (
        <div className="mt-4 p-3.5" style={{ border: '1px solid var(--line-strong)', borderRadius: 8, background: 'var(--surface)' }}>
          <div className="flex items-baseline gap-2">
            <span className="eyebrow" style={{ color: 'var(--accent-text)' }}>
              最终状态
            </span>
            <span className="meta">invoke() 返回的就是这一份</span>
          </div>
          <StateTable state={currentStep.state} />
        </div>
      )}
    </SimFrame>
  )
}
