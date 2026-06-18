import { useEffect, useState } from 'react'
import AppSidebar from './components/AppSidebar'
import Footer from './components/Footer'
import Pages from './components/Pages'
import TopBar from './components/TopBar'
import { SearchProvider } from './components/SearchContext'
import { AuthProvider } from './pages/login/AuthContext'
import AuthContext from './pages/login/context/AuthContext'
import { useAuth } from './pages/login/hooks/useAuth'
import Login from './pages/login/Login'

type BackendState = 'pending' | 'ready' | 'failed'

function BackendLoader({ children }: { children: React.ReactNode }): React.JSX.Element {
  const isDev = import.meta.env.DEV
  const [state, setState] = useState<BackendState>(isDev ? 'ready' : 'pending')

  useEffect(() => {
    if (isDev) return
    const ipc = window.electron?.ipcRenderer
    if (!ipc) { setState('ready'); return }
    ipc.once('backend-ready', (_e, ok: boolean) => setState(ok ? 'ready' : 'failed'))
  }, [isDev])

  if (state === 'pending') {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Iniciando servidor, un momento...</p>
      </div>
    )
  }

  if (state === 'failed') {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <p className="text-destructive font-medium">El servidor no pudo iniciarse.</p>
        <p className="text-sm text-muted-foreground">Revisa el log en: %USERPROFILE%\.kitchapp\backend.log</p>
      </div>
    )
  }

  return <>{children}</>
}

function AppContent(): React.JSX.Element {
  const { isAuthenticated, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">Cargando sesión...</div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <>
      <AppSidebar />
      <div className="flex flex-col w-full justify-between bg-background">
        <TopBar />
        <Pages />
        <Footer />
      </div>
    </>
  )
}

function App(): React.JSX.Element {
  return (
    <BackendLoader>
      <AuthProvider AuthContext={AuthContext}>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </AuthProvider>
    </BackendLoader>
  )
}

export default App
