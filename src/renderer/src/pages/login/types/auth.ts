export interface AuthContextType {
  isAuthenticated: boolean
  isAuthReady: boolean
  login: (accessToken: string, refreshToken?: string) => void
  logout: () => void
}
