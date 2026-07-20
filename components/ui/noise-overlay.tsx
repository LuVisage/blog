'use client'

/**
 * Noise Overlay — subtle grain texture that eliminates "digital flatness."
 * Uses SVG feTurbulence to generate procedural noise.
 * A 2025 design trend — adds warmth and texture to glass-morphism designs.
 */
export function NoiseOverlay({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
    </div>
  )
}
