import { DotsLoader } from '@/components/ui/loader'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <DotsLoader />
        <p className="mt-4 text-sm" style={{ color: 'var(--color-muted)' }}>加载中...</p>
      </div>
    </div>
  )
}
