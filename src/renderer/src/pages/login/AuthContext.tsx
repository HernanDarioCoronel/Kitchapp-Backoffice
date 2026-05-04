import { useEffect, useState, ReactNode, JSX } from 'react'
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

export function AuthProvider({ children, AuthContext }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('authToken'))
  })
  const [isAuthReady, setIsAuthReady] = useState<boolean>(() => {
    return !localStorage.getItem('refreshToken')
  })

  const login = (accessToken: string, refreshToken?: string): void => {
    localStorage.setItem('authToken', accessToken)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
    setIsAuthenticated(true)
  }

  const logout = (): void => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      return
    }

    const refreshSession = async (): Promise<void> => {
      try {
        const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken })
        login(data.accessToken, data.refreshToken)
      } catch {
        logout()
      } finally {
        setIsAuthReady(true)
      }
    }

    void refreshSession()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
