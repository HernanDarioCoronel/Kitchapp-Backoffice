import { useState, ReactNode, JSX } from 'react'
import { AuthContextType } from './types/auth'

interface AuthProviderProps {
  children: ReactNode
  AuthContext: React.Context<AuthContextType | undefined>
}

export function AuthProvider({ children, AuthContext }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Inicializa desde localStorage para mantener la sesión al recargar
    return localStorage.getItem('authToken') ? true : false
  })

  const login = (token: string): void => {
    localStorage.setItem('authToken', token)
    setIsAuthenticated(true)
  }

  const logout = (): void => {
    localStorage.removeItem('authToken')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
