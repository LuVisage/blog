'use client'

import { useTocSpy } from '@/components/use-toc-spy'

/**
 * 页顶阅读进度线（第 20 轮回归）。
 *
 * 第 19 轮把它删了，理由是和目录里的百分比重复；但那 2px 的滚动反馈是
 * 读者最能「感觉到」的东西之一，删掉之后页面像一份静止的 PDF。现在把它做厚到
 * 3px、走强调色渐变（渐变的色标全在令牌里），并且不再和目录抢语义：目录给的是
 * 章节位置，这条给的是整篇进度。
 *
 * 填充有两条路，CSS 那条优先：globals.css 里 @supports (animation-timeline: scroll())
 * 把 scaleX 直接绑到根滚动位置，进度与手指 1:1、不经 React。这里的行内 transform
 * 是降级路 —— CSS 动画在层叠里压过行内样式，所以支持时自动被盖掉，不支持时接管，
 * 不需要 JS 嗅探。行内值仍量化到 1%：它同时喂 aria-valuenow，量化把滚动期间的
 * 重渲染封顶在 100 次。滚动链接不加过渡（挂过渡会滞后于滚动）。
 */
export function ReadingProgress() {
  const { progress } = useTocSpy()
  const percent = Math.round(progress * 100)

  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="阅读进度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`已读 ${percent}%`}
    >
      <div
        className="reading-progress__fill"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
