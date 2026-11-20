import { basePathUrl } from '@/lib/constants'

interface FigurePlateProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

/** 装饰插画按印刷图版落位：墨线框 + 宽高写死防 CLS。图注解释按作者要求关闭，
 *  作者与 CC0 出处只留在 SPEC_LEDGER 的寻源记录里（CC0 不强制署名）。 */
export function FigurePlate({ src, alt, width, height, className }: FigurePlateProps) {
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
    </figure>
  )
}
