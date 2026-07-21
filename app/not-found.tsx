import Link from 'next/link'
import { IconHome, IconError404 } from '@tabler/icons-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <IconError404 size={72} strokeWidth={1} style={{ color: 'var(--color-muted-soft)' }} className="mb-6" />
      <h1 className="heading-1 mb-4">404</h1>
      <h2 className="heading-3 mb-2">哎呀，页面走丢了~</h2>
      <p className="body-md mb-8 max-w-sm">
        你要找的页面可能被猫咪藏起来了，或者从未存在过...
      </p>
      <Link href="/" className="btn-primary">
        <IconHome size={16} strokeWidth={2} />
        回到首页
      </Link>
    </div>
  )
}
