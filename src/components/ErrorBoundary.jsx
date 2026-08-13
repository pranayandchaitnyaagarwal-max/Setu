'use client'

import { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { Button } from '@/components/ui/button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (typeof window !== 'undefined' && window.__setuLogError) {
      window.__setuLogError(error, info)
    }
    try { console.error('[ErrorBoundary]', error, info) } catch {}
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      return (
        <main className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mx-4 max-w-md rounded-2xl bg-neutral-50 p-8 text-center shadow-card dark:bg-white/5"
          >
            <h2 className="mb-3 text-2xl font-bold">Something went wrong</h2>
            <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
              A rendering error occurred on this page. You can retry or reload the
              dashboard.
            </p>
            <div className="flex justify-center gap-3">
              <Button size="sm" onClick={this.reset}>Retry</Button>
              <Button size="sm" variant="outline" onClick={() => location.reload()}>Reload</Button>
            </div>
          </motion.div>
        </main>
      )
    }
    return this.props.children
  }
}
