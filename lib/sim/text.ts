/**
 * Text maths shared by the /learn/agent simulators.
 *
 * Everything here is real arithmetic run in the visitor's browser: tokenising,
 * hashed bag-of-n-gram vectors, cosine, BM25 and RRF. Nothing calls a model, so
 * the numbers on screen can be reproduced by hand — and compared against the
 * Python in the lesson.
 */

const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿]/

/** CJK gets unigrams + bigrams, latin/digits stay whole words. */
export function tokenize(text: string): string[] {
  const lowered = text.toLowerCase()
  const tokens: string[] = []
  let word = ''
  const flush = () => {
    if (word) tokens.push(word)
    word = ''
  }
  for (let i = 0; i < lowered.length; i++) {
    const ch = lowered[i]
    if (CJK.test(ch)) {
      flush()
      tokens.push(ch)
      const next = lowered[i + 1]
      if (next && CJK.test(next)) tokens.push(ch + next)
    } else if (/[a-z0-9.]/.test(ch)) {
      word += ch
    } else {
      flush()
    }
  }
  flush()
  return tokens
}

function fnv1a(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash >>> 0
}

/**
 * Fixed-width hashed vector. Two different hashes pick the slot and its sign so
 * collisions average out instead of always adding.
 */
export function hashVector(text: string, dim = 96): number[] {
  const vector = new Array<number>(dim).fill(0)
  for (const token of tokenize(text)) {
    const h = fnv1a(token)
    vector[h % dim] += (fnv1a(token + '#') & 1 ? 1 : -1) * (1 + Math.log1p(token.length))
  }
  return normalize(vector)
}

/**
 * Because the model is linear, cosine against a normalised document vector
 * decomposes into one signed term per query token. Hash collisions between
 * different tokens are ignored, so read it as an approximation of why a score
 * came out the way it did.
 */
export function tokenContributions(query: string, docText: string, dim = 96) {
  const doc = hashVector(docText, dim)
  const weights = new Map<string, number>()
  const slots = new Map<string, number>()
  for (const token of tokenize(query)) {
    const sign = fnv1a(token + '#') & 1 ? 1 : -1
    weights.set(token, (weights.get(token) || 0) + sign * (1 + Math.log1p(token.length)))
    slots.set(token, fnv1a(token) % dim)
  }
  const norm = Math.sqrt([...weights.values()].reduce((sum, w) => sum + w * w, 0)) || 1
  return [...weights.entries()]
    .map(([term, weight]) => ({ term, weight: (weight / norm) * doc[slots.get(term) ?? 0] }))
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
}

export function normalize(vector: readonly number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0))
  return norm === 0 ? vector.slice() : vector.map((v) => v / norm)
}

/** Cosine of two vectors; callers pass normalised input, so this is a dot product. */
export function cosine(a: readonly number[], b: readonly number[]): number {
  let dot = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) dot += a[i] * b[i]
  return dot
}

export interface Bm25Index {
  /** Scores every document for a query, highest first. */
  search(query: string): { index: number; score: number }[]
  /** Term-by-term contribution, used to explain why a document matched. */
  explain(query: string, index: number): { term: string; weight: number }[]
}

/** Okapi BM25 with the usual k1 = 1.2, b = 0.75. */
export function buildBm25(texts: string[], k1 = 1.2, b = 0.75): Bm25Index {
  const docs = texts.map(tokenize)
  const docCount = docs.length || 1
  const avgLen = docs.reduce((sum, d) => sum + d.length, 0) / docCount || 1

  const df = new Map<string, number>()
  docs.forEach((tokens) => {
    new Set(tokens).forEach((token) => df.set(token, (df.get(token) || 0) + 1))
  })

  const idf = (token: string) =>
    Math.log(1 + (docCount - (df.get(token) || 0) + 0.5) / ((df.get(token) || 0) + 0.5))

  function scoreOf(query: string, docIndex: number) {
    const counts = new Map<string, number>()
    docs[docIndex].forEach((token) => counts.set(token, (counts.get(token) || 0) + 1))
    const length = docs[docIndex].length
    let score = 0
    new Set(tokenize(query)).forEach((token) => {
      const tf = counts.get(token) || 0
      if (!tf) return
      score += idf(token) * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * length) / avgLen)))
    })
    return score
  }

  return {
    search(query) {
      return docs
        .map((_, index) => ({ index, score: scoreOf(query, index) }))
        .sort((a, b2) => b2.score - a.score)
    },
    explain(query, index) {
      const counts = new Map<string, number>()
      docs[index].forEach((token) => counts.set(token, (counts.get(token) || 0) + 1))
      return [...new Set(tokenize(query))]
        .filter((token) => counts.has(token))
        .map((term) => ({ term, weight: idf(term) * counts.get(term)! }))
        .sort((a, b2) => b2.weight - a.weight)
    },
  }
}

/**
 * Reciprocal Rank Fusion — the same formula as Milvus' RRFRanker(60).
 * Each list is a ranking of document indices, best first.
 */
export function rrf(rankings: number[][], k = 60) {
  const totals = new Map<number, { score: number; votes: string[] }>()
  rankings.forEach((ranking, listIndex) => {
    ranking.forEach((docIndex, rank) => {
      const entry = totals.get(docIndex) || { score: 0, votes: [] }
      entry.score += 1 / (k + rank + 1)
      entry.votes.push(String(listIndex))
      totals.set(docIndex, entry)
    })
  })
  return [...totals.entries()]
    .map(([index, entry]) => ({ index, ...entry }))
    .sort((a, b) => b.score - a.score)
}

/** Rough token count for the cost meter: CJK ≈ 1 token/字, latin ≈ 4 chars/token. */
export function estimateTokens(text: string): number {
  let cjk = 0
  let rest = 0
  for (const ch of text) {
    if (CJK.test(ch)) cjk += 1
    else if (!/\s/.test(ch)) rest += 1
  }
  return cjk + Math.ceil(rest / 4)
}
