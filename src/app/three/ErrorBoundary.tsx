import { Component, type ReactNode } from 'react'

interface SceneErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface SceneErrorBoundaryState {
  failed: boolean
}

export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}
