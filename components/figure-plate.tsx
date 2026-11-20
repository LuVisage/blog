import { basePathUrl } from '@/lib/constants'

interface FigurePlateProps {
  src: string
  alt: string
  width: number
  height: number
  fig: string
  caption: string
  author: string
  source: string
  className?: string
}

/** 装饰插画按印刷图版落位：墨线框 + mono 图注 + 作者与 CC0 出处，宽高写死防 CLS。 */
export function FigurePlate({ src, alt, width, height, fig, caption, author, source, className }: FigurePlateProps) {
  return (
    <figure className={`plate ${className ?? ''}`}>
      <img
        src={basePathUrl(src)}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="plate-img"
      />
      <figcaption className="meta plate-cap">
        FIG. {fig} — {caption} · {author} ·{' '}
        <a href={source} target="_blank" rel="noopener noreferrer">CC0</a>
      </figcaption>
    </figure>
  )
}
