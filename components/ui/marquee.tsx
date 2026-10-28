/**
 * Marquee — 单行内容带。
 *
 * 语汇来自设计文档本身：§11.3 的关键帧清单里有 `marquee`，§11.2 还实测到
 * `.logo_marquee:hover { animation-play-state: paused }`。所以这里只动 transform，
 * 悬停与键盘聚焦时暂停；系统开启「减少动态效果」时静止并可换行读完。
 *
 * 无缝循环靠把同一组内容渲染两次：轨道整体左移 50%，衔接处没有跳变。
 * 第二次渲染对辅助技术隐藏，读屏只会读到一遍内容。
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
    <div className="marquee" role="group" aria-label={label}>
      <div className="marquee__track">
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}
