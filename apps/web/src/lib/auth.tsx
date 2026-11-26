/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'
import type { User } from './types'

interface Auth {
  user: User | null
  ready: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<Auth | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => setUser(await api.get<User>('/users/me')), [])

  useEffect(() => {
    api
      .get<User>('/users/me')
      .then(setUser, () => setUser(null))
      .finally(() => setReady(true))
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/sign-out').catch(() => {})
    setUser(null)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      await api.post('/auth/sign-in/email', { email, password })
      try {
        await refresh()
      } catch (error) {
        await logout()
        throw error
      }
    },
    [refresh, logout],
  )

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('AuthProvider is missing')
  return auth
}

/** The signed-in user; only call inside protected screens. */
export function useUser() {
  return useAuth().user!
}
