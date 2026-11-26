import { useCallback, useEffect, useState } from 'react'
import { api } from './api'

/** GET `path` and refetch when it changes. Pass `null` to skip. */
export function useData<T>(path: string | null) {
  const [state, setState] = useState<{ path?: string; data?: T; error?: string }>({})
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!path) return
    let stale = false
    api.get<T>(path).then(
      (data) => !stale && setState({ path, data }),
      (error: Error) => !stale && setState({ path, error: error.message }),
    )
    return () => {
      stale = true
    }
  }, [path, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return {
    // Keeps the previous result while the next one loads.
    data: state.data,
    error: state.path === path ? state.error : undefined,
    loading: path !== null && state.path !== path,
    reload,
  }
}
