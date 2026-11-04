'use client'

import { useTocSpy } from '@/components/use-toc-spy'

/**
 * ReadingProgress —— 页顶 2px 阅读进度线。
 *
 * 第 6 轮之前它自己挂 scroll 监听、每个滚动事件 setState 一次，并且过渡 `width`
 * （SPEC_LEDGER §1.8.1 的属性白名单只有 transform / opacity / color）。
 * 现在改读 §11.11 的单例扫描器（全站一份监听、量化到 1%），
 * 填充用 scaleX + transform-origin: left —— 滚动链接不加过渡，避免滞后于滚动。
 */
export function ReadingProgress() {
  const { progress } = useTocSpy()
  const percent = Math.round(progress * 100)

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-0.5"
      role="progressbar"
      aria-label="阅读进度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`已读 ${percent}%`}
    >
      <div
        className="h-full will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left center',
          backgroundColor: 'var(--accent)',
        }}
      />
    </div>
  )
}
