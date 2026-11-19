'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            组件加载失败
          </span>
          <button onClick={() => this.setState({ hasError: false })} className="btn-ghost text-xs">
            重试
          </button>
        </div>
      )
    )
  }
}
