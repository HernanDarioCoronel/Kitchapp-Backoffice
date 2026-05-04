export interface AuthContextType {
  isAuthenticated: boolean
  isAuthReady: boolean
  login: (accessToken: string, refreshToken?: string, expiresIn?: number) => void
  logout: () => void
}
