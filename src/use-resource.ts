'use client'

/**
 * A small fetch helper: loading and error state, optional periodic refresh.
 * A cache/mutation library is worth adding only when a screen needs more.
 *
 * `enabled` exists for a question that should not be asked yet — a count for a
 * service this realm may not have, a list that needs an organization first.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

export type Resource<T> = {
  data: T | undefined
  error: string | undefined
  loading: boolean
  reload: () => void
}

export type ResourceOptions = {
  refreshMs?: number
  /** Re-runs when this changes — an id the fetcher closes over, usually. */
  key?: string
  enabled?: boolean
  /** Shown when the failure carries no message of its own. */
  fallbackError?: string
}

export function useResource<T>(fetcher: () => Promise<T>, options: ResourceOptions = {}): Resource<T> {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [nonce, setNonce] = useState(0)
  // Held in a ref so a caller may write the fetcher inline without the effect
  // re-running on every render.
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const enabled = options.enabled ?? true
  const fallback = options.fallbackError ?? 'That did not answer'

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    const run = async () => {
      try {
        const result = await fetcherRef.current()
        if (cancelled) return
        setData(result)
        setError(undefined)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error && err.message ? err.message : fallback)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    const timer = options.refreshMs ? setInterval(run, options.refreshMs) : undefined
    return () => {
      cancelled = true
      if (timer) clearInterval(timer)
    }
  }, [nonce, options.refreshMs, options.key, enabled, fallback])

  return { data, error, loading, reload }
}
