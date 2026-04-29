import { useContext } from 'react'
import { AuthContextType } from '../types/auth'
import AuthContext from '../context/AuthContext'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
