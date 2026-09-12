/**
 * A browser port of LangChain's RecursiveCharacterTextSplitter.
 *
 * Mirrors `character.py::_split_text` and `base.py::_merge_splits` / `_join_docs`
 * under the configuration day06_chunking.py actually runs: `keep_separator=True`,
 * `strip_whitespace=True` and `length=len`. keep_separator is the part most
 * hand-written ports get wrong — the separator is kept and glued to the piece
 * *after* it, so merging joins with `''` instead of re-inserting it, and overlap
 * therefore carries whole pieces rather than a tail of characters.
 *
 * Length is counted in code points to match Python's `len()` for these texts.
 * `scripts/check-sim.mjs` diffs the result against the installed library.
 */

export const DEFAULT_SEPARATORS = ['\n\n', '\n', '。', '！', '？', '，', ' ', '']
export const PLAIN_SEPARATORS = ['\n\n', '\n', ' ', '']

const chars = (text: string) => [...text].length

/** `re.split(f'({separator})', text)` with each separator glued to what follows. */
function splitKeeping(text: string, separator: string): string[] {
  if (!separator) return [...text]
  const parts = text.split(separator)
  const kept: string[] = []
  parts.forEach((part, index) => {
    kept.push(part)
    if (index < parts.length - 1) kept.push(separator)
  })
  const out = [kept[0]]
  for (let i = 1; i < kept.length; i += 2) out.push(kept[i] + (kept[i + 1] ?? ''))
  return out.filter(Boolean)
}

/** `_join_docs`: glue the run back together, trim the edges, drop empties. */
function joinDocs(docs: string[], separator: string): string | null {
  return docs.join(separator).trim() || null
}

/** Greedy accumulate, then pop whole pieces off the front to leave room. */
function mergeSplits(splits: string[], separator: string, size: number, overlap: number): string[] {
  const separatorLength = chars(separator)
  const docs: string[] = []
  let currentDoc: string[] = []
  let total = 0

  for (const d of splits) {
    const len = chars(d)
    if (total + len + (currentDoc.length > 0 ? separatorLength : 0) > size) {
      if (currentDoc.length > 0) {
        const doc = joinDocs(currentDoc, separator)
        if (doc !== null) docs.push(doc)
        while (
          total > overlap ||
          (total + len + (currentDoc.length > 0 ? separatorLength : 0) > size && total > 0)
        ) {
          total -= chars(currentDoc[0]) + (currentDoc.length > 1 ? separatorLength : 0)
          currentDoc = currentDoc.slice(1)
        }
      }
    }
    currentDoc.push(d)
    total += len + (currentDoc.length > 1 ? separatorLength : 0)
  }

  const doc = joinDocs(currentDoc, separator)
  if (doc !== null) docs.push(doc)
  return docs
}

function splitRecursively(
  text: string,
  size: number,
  overlap: number,
  separators: string[]
): string[] {
  const finalChunks: string[] = []
  let separator = separators[separators.length - 1]
  let newSeparators: string[] = []

  for (let i = 0; i < separators.length; i++) {
    const candidate = separators[i]
    if (!candidate) {
      separator = candidate
      break
    }
    if (text.includes(candidate)) {
      separator = candidate
      newSeparators = separators.slice(i + 1)
      break
    }
  }

  const splits = splitKeeping(text, separator)
  // keep_separator=True means the pieces already carry their separator.
  const mergeSeparator = ''
  let good: string[] = []

  for (const piece of splits) {
    if (chars(piece) < size) {
      good.push(piece)
      continue
    }
    if (good.length) {
      finalChunks.push(...mergeSplits(good, mergeSeparator, size, overlap))
      good = []
    }
    if (!newSeparators.length) finalChunks.push(piece)
    else finalChunks.push(...splitRecursively(piece, size, overlap, newSeparators))
  }

  if (good.length) finalChunks.push(...mergeSplits(good, mergeSeparator, size, overlap))
  return finalChunks
}

export function splitText(
  text: string,
  {
    chunkSize,
    overlap,
    separators = DEFAULT_SEPARATORS,
  }: { chunkSize: number; overlap: number; separators?: string[] }
): string[] {
  return splitRecursively(text, Math.max(1, chunkSize), Math.max(0, overlap), separators)
}
