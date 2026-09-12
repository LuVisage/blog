'use client'

import dynamic from 'next/dynamic'
import type { SimSpec } from '@/lib/sim/registry'

/**
 * Each lab is its own chunk: a lesson only downloads the simulators it renders,
 * and none of them run during static generation.
 */
const ChunkLab = dynamic(() => import('./sim/chunk-lab').then((m) => m.ChunkLab), { ssr: false, loading: fallback })
const VectorLab = dynamic(() => import('./sim/vector-lab').then((m) => m.VectorLab), { ssr: false, loading: fallback })
const HybridLab = dynamic(() => import('./sim/hybrid-lab').then((m) => m.HybridLab), { ssr: false, loading: fallback })
const FilterLab = dynamic(() => import('./sim/filter-lab').then((m) => m.FilterLab), { ssr: false, loading: fallback })
const GraphPlayer = dynamic(() => import('./sim/graph-player').then((m) => m.GraphPlayer), { ssr: false, loading: fallback })
const AlgoLab = dynamic(() => import('./sim/algo-lab').then((m) => m.AlgoLab), { ssr: false, loading: fallback })
const TracePlayer = dynamic(() => import('./sim/trace-player').then((m) => m.TracePlayer), { ssr: false, loading: fallback })
const Playground = dynamic(() => import('./playground').then((m) => m.Playground), { ssr: false, loading: fallback })

function fallback() {
  return (
    <div className="learn-block not-prose" style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 18 }}>
      <div className="skeleton-line" style={{ width: 160 }} />
      <div className="skeleton-line mt-3" style={{ width: '70%' }} />
      <div className="skeleton-line mt-2" style={{ width: '45%' }} />
    </div>
  )
}

export function SimulatorClient({ specs }: { specs: SimSpec[] }) {
  return (
    <>
      {specs.map((spec, index) => {
        const key = `${spec.kind}-${index}`
        switch (spec.kind) {
          case 'chunk':
            return <ChunkLab key={key} />
          case 'vector':
            return <VectorLab key={key} presets={spec.presets} />
          case 'hybrid':
            return <HybridLab key={key} />
          case 'filter':
            return <FilterLab key={key} mode={spec.mode} />
          case 'algo':
            return <AlgoLab key={key} algo={spec.algo} />
          case 'graph':
            return <GraphPlayer key={key} graph={spec.graph} checkpoint={spec.checkpoint} label={spec.label} hint={spec.hint} />
          case 'trace':
            return <TracePlayer key={key} trace={spec.trace} label={spec.label} hint={spec.hint} />
          case 'playground':
            return <Playground key={key} mode={spec.mode} label={spec.label} hint={spec.hint} history={spec.history} seed={spec.seed} />
          default:
            return null
        }
      })}
    </>
  )
}
