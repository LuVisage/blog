import type { GraphFixture, GraphState } from './corpus'

export interface GraphStep {
  node: string
  summary: string
  /** State after this node ran — a checkpoint you could resume from. */
  state: GraphState
  /** Which branch the conditional edge took, when this node routes. */
  branch?: string
}

export type GraphStatus = 'paused' | 'done' | 'limit'

export interface GraphRun {
  steps: GraphStep[]
  status: GraphStatus
  /** The pause node still waiting for a decision. */
  pending?: string
}

function nextOf(fixture: GraphFixture, from: string): string | undefined {
  return fixture.edges.find((edge) => edge.from === from)?.to
}

/**
 * Runs the toy graph to completion, or stops at the first `pauses` node when no
 * decision has been supplied yet. Deterministic, so the UI only needs a cursor.
 */
export function runGraph(
  fixture: GraphFixture,
  decision: { approved?: boolean; startFrom?: GraphStep } = {}
): GraphRun {
  const byName = new Map(fixture.nodes.map((node) => [node.name, node]))
  const steps: GraphStep[] = []
  let state: GraphState = decision.startFrom ? { ...decision.startFrom.state } : { ...fixture.initial }
  let current = decision.startFrom
    ? decision.startFrom.branch ?? nextOf(fixture, decision.startFrom.node)
    : nextOf(fixture, '__start__')

  while (current && current !== '__end__') {
    const node = byName.get(current)
    if (!node) return { steps, status: 'limit' }

    if (node.pauses) {
      if (decision.approved === undefined) {
        return { steps, status: 'paused', pending: node.name }
      }
      state = { ...state, [node.pauses]: decision.approved }
    }

    state = node.apply(state)
    let branch: string | undefined

    if (fixture.router && fixture.router.at === node.name) {
      branch = fixture.router.pick(state)
      current = branch
    } else {
      current = nextOf(fixture, node.name)
    }

    steps.push({ node: node.name, summary: node.summary, state, branch })
    if (steps.length >= fixture.limit) return { steps, status: 'limit' }
  }

  return { steps, status: 'done' }
}

/** Keys worth showing in the state table — internal bookkeeping stays hidden. */
export function stateEntries(state: GraphState): [string, string][] {
  return Object.entries(state).map(([key, value]) => [
    key,
    Array.isArray(value) ? value.join(' → ') : String(value),
  ])
}
