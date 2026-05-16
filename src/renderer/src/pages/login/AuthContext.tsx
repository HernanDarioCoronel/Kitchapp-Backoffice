import { useEffect, useRef, useState, useCallback, ReactNode, JSX } from 'react'
import { AuthContextType } from './types/auth'
import apiClient from '@/lib/api-client'

interface AuthResponse {
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
}

interface AuthProviderProps {
  children: ReactNode
  AuthContext: React.Context<AuthContextType | undefined>
}

const REFRESH_SAFETY_WINDOW_MS = 60_000

function getRefreshDelay(expiresIn?: number): number | null {
  if (expiresIn === undefined || Number.isNaN(expiresIn)) {
    return null
  }
  const expiresAt = Date.now() + expiresIn * 1000
  const delay = expiresAt - Date.now() - REFRESH_SAFETY_WINDOW_MS
  return Math.max(0, delay)
}

export function AuthProvider({ children, AuthContext }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('authToken'))
  })
  const [isAuthReady, setIsAuthReady] = useState<boolean>(() => {
    return !localStorage.getItem('refreshToken')
  })

  const refreshTimerRef = useRef<number | null>(null)

  // Fix 1: useRef<T>() with no arg requires undefined as the type param
  const refreshSessionRef = useRef<(() => Promise<void>) | undefined>(undefined)

  const clearRefreshTimer = useCallback((): void => {
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }, [])

  const scheduleRefresh = useCallback(
    (expiresIn?: number): void => {
      clearRefreshTimer()
      const delay = getRefreshDelay(expiresIn)
      if (delay === null) return
      refreshTimerRef.current = window.setTimeout(() => {
        void refreshSessionRef.current?.()
      }, delay)
    },
    [clearRefreshTimer]
  )

  const logout = useCallback((): void => {
    clearRefreshTimer()
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
  }, [clearRefreshTimer])

  const login = useCallback(
    (accessToken: string, refreshToken?: string, expiresIn?: number): void => {
      localStorage.setItem('authToken', accessToken)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      } else {
        localStorage.removeItem('refreshToken')
      }
      setIsAuthenticated(true)
      scheduleRefresh(expiresIn)
    },
    [scheduleRefresh]
  )

  const refreshSession = useCallback(async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      logout()
      setIsAuthReady(true)
      return
    }
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken })
      login(data.accessToken, data.refreshToken, data.expiresIn)
    } catch {
      logout()
    } finally {
      setIsAuthReady(true)
    }
  }, [login, logout])

  // Fix 2: update the ref inside an effect, not during render
  useEffect(() => {
    refreshSessionRef.current = refreshSession
  }, [refreshSession])

  // Fix 3: don't call refreshSession() directly in the effect body —
  // invoke it inside a local async function so setState calls happen
  // asynchronously and don't trigger the cascading-renders warning
  useEffect(() => {
    if (!localStorage.getItem('refreshToken')) return

    const run = async (): Promise<void> => {
      await refreshSession()
    }

    void run()

    return () => clearRefreshTimer()
  }, [refreshSession, clearRefreshTimer])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
