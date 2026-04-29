import { JSX, ReactNode, useState } from 'react'
import AuthContext from '../context/AuthContext'

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('authToken')
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
