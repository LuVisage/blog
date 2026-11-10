/**
 * 文章封面。
 *
 * 默认用同一件「LLM 核心 + 5 个 Agent 节点」3D 模型的三个渲染角度
 * （public/images/3d/），与首页那件可交互模型是同一个东西，语义上对应
 * 本站的 5 门课程体系。按 slug 做稳定哈希分配，零写作成本。
 *
 * 作者也可以在 frontmatter 写 `cover: /images/foo.jpg` 覆盖；外链原样使用，
 * 站内路径统一过 basePathUrl，本地开发（无前缀）与 GitHub Pages（/blog）都能取到。
 */
import { basePathUrl } from '@/lib/constants'

const COVER_IMAGES = [
  '/images/3d/cover-1.webp',
  '/images/3d/cover-2.webp',
  '/images/3d/cover-3.webp',
] as const

const COVER_ALTS = [
  'LLM 核心与五个 Agent 节点组成的 3D 网络拓扑（正面视角）',
  'LLM 核心与五个 Agent 节点组成的 3D 网络拓扑（侧转视角）',
  'LLM 核心与五个 Agent 节点组成的 3D 网络拓扑（俯视视角）',
] as const

export interface CoverInput {
  slug: string
  title?: string
  tags?: string[]
  category?: string
  cover?: string
}

export interface Cover {
  url: string
  alt: string
}

/** FNV-1a：小、稳定，足够把 slug 均匀摊到三张图上。 */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function coverFor(input: CoverInput): Cover {
  if (input.cover) {
    const url = /^https?:\/\//i.test(input.cover) ? input.cover : basePathUrl(input.cover)
    return { url, alt: input.title || '' }
  }

  const index = hash(input.slug) % COVER_IMAGES.length
  return {
    url: basePathUrl(COVER_IMAGES[index]),
    alt: COVER_ALTS[index],
  }
}
