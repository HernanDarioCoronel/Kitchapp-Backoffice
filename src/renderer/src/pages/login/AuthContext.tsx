import { useEffect, useRef, useState, ReactNode, JSX } from 'react'
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

  const clearRefreshTimer = (): void => {
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }

  const scheduleRefresh = (expiresIn?: number): void => {
    clearRefreshTimer()

    const delay = getRefreshDelay(expiresIn)
    if (delay === null) {
      return
    }

    refreshTimerRef.current = window.setTimeout(() => {
      void refreshSession()
    }, delay)
  }

  const refreshSession = async (): Promise<void> => {
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
  }

  const login = (accessToken: string, refreshToken?: string, expiresIn?: number): void => {
    localStorage.setItem('authToken', accessToken)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
    setIsAuthenticated(true)
    scheduleRefresh(expiresIn)
  }

  const logout = (): void => {
    clearRefreshTimer()
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      return
    }

    void refreshSession()
    return () => {
      clearRefreshTimer()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
