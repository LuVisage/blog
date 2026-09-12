/**
 * Fixed backdrop painted under the page content.
 * Order (back → front): accent glow, grid, vignette.
 */
export function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <div className="absolute inset-0 bg-glow" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-vignette" />
    </div>
  )
}
