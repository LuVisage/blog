'use client'

import { useTocSpy } from '@/components/use-toc-spy'

// CSS scroll-timeline 那条路在层叠里压过行内 transform，支持时自动接管、不支持时行内兜底；
// 量化到 1% 既喂 aria-valuenow 也把滚动重渲染封顶 100 次；填充不挂过渡，否则会滞后于滚动。
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
      <div className="reading-progress__fill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}
