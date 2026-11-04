'use client'

/**
 * Marquee — 单行内容带。
 *
 * 语汇来自设计文档本身：§11.3 的关键帧清单里有 `marquee`，§11.2 还实测到
 * `.logo_marquee:hover { animation-play-state: paused }`。所以这里只动 transform，
 * 悬停暂停；键盘聚焦时轨道还要收回原点，焦点环才不会被裁在可视带外。
 * 系统开启「减少动态效果」时静止并可换行读完。
 *
 * 无缝循环靠把同一组内容渲染两次：轨道整体左移 50%，衔接处没有跳变。
 * 第二次渲染是纯视觉替身，用 inert 摘掉（aria-hidden 只挡读屏，不挡焦点）。
 */
export function Marquee({
  children,
  label,
}: {
  children: React.ReactNode
  /** 供读屏使用的分组名，例如「主题标签」。 */
  label?: string
}) {
  return (
    <div
      className="marquee"
      role="group"
      aria-label={label}
      // 聚焦时 CSS 把轨道收回原点，浏览器横向滚动可视带露出那枚胶囊。焦点走开
      // 后动画恢复，但 scrollLeft 不会自己归零 —— 不清掉，轨道尾巴会滚出视野、
      // 右侧空出来。归零正好对上重新起跑的 translateX(0)。
      // React 的 onBlur 是 focusout，会冒泡到容器；组内换格也触发，所以要认 relatedTarget。
      onBlur={(e) => {
        const next = e.relatedTarget
        if (next instanceof Node && e.currentTarget.contains(next)) return
        e.currentTarget.scrollLeft = 0
      }}
    >
      <div className="marquee__track">
        <div className="marquee__group">{children}</div>
        {/* 第二份是无缝循环的视觉替身：aria-hidden 只把它从读屏里拿掉，链接照样进
            Tab 序列（等于每个标签都有两格焦点，第二格还裁在可视带外面）。inert 才是
            真的不响应输入 —— 焦点、点击、播报一起摘掉。aria-hidden 留着当老浏览器兜底。 */}
        <div className="marquee__group" aria-hidden="true" inert>{children}</div>
      </div>
    </div>
  )
}
