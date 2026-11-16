import Link from 'next/link'
import { COURSE_IDS, getCurriculumStats } from '@/lib/curriculum'

/**
 * 课程体系图版 —— 取代首页那件 three.js 可旋转模型。
 *
 * 换掉的理由是量出来的：模型本体 733KB GLB + three 运行时约 360KB，
 * 而它表达的信息只有一句「5 门课、239 课次围着 LLM 核心」。这句话用一张
 * 服务端渲染的 SVG 图版就能讲完，零 JS、零额外请求，且与报纸方向同一种嗓音
 * （直角连线、双细线框、墨色不发光）。窄屏另给一份 HTML 清单：SVG 缩到
 * 360px 宽时字号会掉到 7px，那不是可读的图，是装饰。
 */

const LABEL: Record<string, { name: string; note: string }> = {
  devtool: { name: '开发工具链', note: '工具箱' },
  ml: { name: '机器学习', note: '17 周' },
  backend: { name: 'Python 后端', note: '工程化' },
  agent: { name: 'Agent 实战', note: '到生产级' },
  csp: { name: 'CSP 认证', note: '20 天冲刺' },
}

// 左二右三的直角编排：核心居中，连线只走横竖，像报纸上的示意图而不是网络拓扑。
const LEFT = [
  { id: 'devtool', y: 96 },
  { id: 'ml', y: 210 },
]
const RIGHT = [
  { id: 'backend', y: 60 },
  { id: 'agent', y: 154 },
  { id: 'csp', y: 248 },
]

const NODE_W = 180
const NODE_H = 56
const CORE = { x: 310, y: 150, w: 140, h: 64 }

export function CoursePlate() {
  const rows = COURSE_IDS.map((id) => {
    const stats = getCurriculumStats(id)
    return { id, ...LABEL[id], lessons: stats.lessons, weeks: stats.weeks }
  })
  const total = rows.reduce((sum, r) => sum + r.lessons, 0)

  const node = (id: string, x: number, y: number) => {
    const r = rows.find((row) => row.id === id)!
    return (
      <Link
        key={id}
        href={`/learn/${id}`}
        className="course-plate__node"
        aria-label={`${r.name}：${r.lessons} 篇课次，${r.weeks} 周`}
      >
        <rect x={x} y={y} width={NODE_W} height={NODE_H} className="course-plate__box" />
        <text x={x + 14} y={y + 24} className="course-plate__name">
          {r.name}
        </text>
        <text x={x + 14} y={y + 42} className="course-plate__meta">
          {r.lessons} 课次 · {r.weeks} 周
        </text>
        <text x={x + NODE_W - 14} y={y + 24} className="course-plate__note" textAnchor="end">
          {r.note}
        </text>
      </Link>
    )
  }

  return (
    <div className="course-plate">
      <svg
        className="course-plate__svg"
        viewBox="0 0 760 360"
        role="group"
        aria-label={`课程体系编排图：${rows.length} 门课程、${total} 篇课次围绕 LLM 核心`}
      >
        <rect x="1" y="1" width="758" height="358" className="course-plate__frame" />
        <rect x="6" y="6" width="748" height="348" className="course-plate__frame-inner" />

        <text x="24" y="34" className="course-plate__caption">
          课程体系 · 编排图
        </text>
        <text x="736" y="34" className="course-plate__caption" textAnchor="end">
          {rows.length} 门 · {total} 课次
        </text>
        <line x1="24" y1="46" x2="736" y2="46" className="course-plate__rule" />

        {/* 连线先画，节点后画，墨线压在框底下 */}
        <g className="course-plate__wires" aria-hidden="true">
          <path d={`M ${CORE.x} 182 H 268 V 124 H 220`} />
          <path d={`M ${CORE.x} 182 H 268 V 238 H 220`} />
          <path d={`M ${CORE.x + CORE.w} 182 H 492 V 88 H 540`} />
          <path d={`M ${CORE.x + CORE.w} 182 H 540`} />
          <path d={`M ${CORE.x + CORE.w} 182 H 492 V 276 H 540`} />
        </g>

        {LEFT.map((n) => node(n.id, 40, n.y))}
        {RIGHT.map((n) => node(n.id, 540, n.y))}

        <g className="course-plate__core">
          <rect x={CORE.x} y={CORE.y} width={CORE.w} height={CORE.h} className="course-plate__core-box" />
          <rect
            x={CORE.x + 5}
            y={CORE.y + 5}
            width={CORE.w - 10}
            height={CORE.h - 10}
            className="course-plate__core-inner"
          />
          <text x={CORE.x + CORE.w / 2} y={CORE.y + 32} className="course-plate__core-name" textAnchor="middle">
            LLM
          </text>
          <text x={CORE.x + CORE.w / 2} y={CORE.y + 50} className="course-plate__core-meta" textAnchor="middle">
            大模型核心
          </text>
        </g>

        <text x="380" y="336" className="course-plate__foot" textAnchor="middle">
          每门课都是跟着做完的课次，不是文档转述
        </text>
      </svg>

      {/* 窄屏：同一份数据的可读清单，不靠缩放 */}
      <ol className="course-plate__list">
        {rows.map((r) => (
          <li key={r.id}>
            <Link href={`/learn/${r.id}`}>
              <span className="course-plate__list-name">{r.name}</span>
              <span className="course-plate__list-meta">
                {r.lessons} 课次 · {r.weeks} 周
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
