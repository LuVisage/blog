'use client'

import { useEffect, useRef, useState } from 'react'
import { IconX } from '@tabler/icons-react'

interface ZoomImage {
  src: string
  alt: string
}

/**
 * 正文图片的点击放大。
 *
 * 采用「水合后增强」而不是把图片包进 <button>：
 * - 静态 HTML 里图片仍是普通图片，关掉 JS 不会多出一枚按下去没反应的钮；
 * - 挂载后才补 role / tabIndex / 键盘处理，图片本身仍是 MDX 产出的同一个节点，
 *   不参与 React 的 DOM 重排，也就不会和水合结果打架。
 *
 * 原生 <dialog> 负责焦点陷阱与 Esc；这里只补背景点击、焦点归还和样式。
 */
export function ImageLightbox() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const [active, setActive] = useState<ZoomImage | null>(null)

  useEffect(() => {
    const root = document.getElementById('main-content')
    if (!root) return

    const images = Array.from(root.querySelectorAll<HTMLImageElement>('img[data-zoomable], .prose img'))
    const cleanups: Array<() => void> = []

    for (const img of images) {
      // 链接里的图片与 3D 舞台不归灯箱管：前者应该继续跳转，后者自己会转。
      if (img.closest('a') || img.closest('.model3d')) continue
      if (!img.getAttribute('src')) continue

      img.classList.add('is-zoomable')
      img.tabIndex = 0
      img.setAttribute('role', 'button')
      img.setAttribute('aria-label', img.alt ? `放大图片：${img.alt}` : '放大图片')

      const open = () => {
        restoreFocus.current = img
        setActive({ src: img.currentSrc || img.src, alt: img.alt })
      }
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        open()
      }

      img.addEventListener('click', open)
      img.addEventListener('keydown', onKeyDown)
      cleanups.push(() => {
        img.classList.remove('is-zoomable')
        img.removeAttribute('tabindex')
        img.removeAttribute('role')
        img.removeAttribute('aria-label')
        img.removeEventListener('click', open)
        img.removeEventListener('keydown', onKeyDown)
      })
    }

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !active) return
    if (!dialog.open) dialog.showModal()
    closeRef.current?.focus()
  }, [active])

  const close = () => dialogRef.current?.close()

  return (
    <dialog
      ref={dialogRef}
      className="image-lightbox"
      aria-label="图片预览"
      onClose={() => {
        setActive(null)
        // 关闭后把焦点还给触发图片；否则读屏与键盘用户会掉回 body。
        restoreFocus.current?.focus?.()
      }}
      onCancel={(event) => {
        // 显式接管原生 cancel：不同浏览器对 top layer 的 Esc 投递时机不一致，
        // 统一走 close()，onClose 里的焦点归还会稳定发生。
        event.preventDefault()
        close()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          close()
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="image-lightbox__panel">
        {active && (
          <img
            className="image-lightbox__img"
            src={active.src}
            alt={active.alt || '放大的图片'}
            decoding="async"
          />
        )}
        <div className="image-lightbox__bar">
          <p className="image-lightbox__caption">{active?.alt || '图片预览'}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="image-lightbox__close pressable"
            aria-label="关闭图片预览"
          >
            <IconX size={16} strokeWidth={1.75} aria-hidden="true" />
            关闭
          </button>
        </div>
      </div>
    </dialog>
  )
}
