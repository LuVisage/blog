'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
            组件加载失败
          </span>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-ghost text-xs"
          >
            重试
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
