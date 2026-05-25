import AppSidebar from './components/AppSidebar'
import Footer from './components/Footer'
import Pages from './components/Pages'
import TopBar from './components/TopBar'
import { SearchProvider } from './components/SearchContext'
import { AuthProvider } from './pages/login/AuthContext'
import AuthContext from './pages/login/context/AuthContext'
import { useAuth } from './pages/login/hooks/useAuth'
import Login from './pages/login/Login'

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
    <AuthProvider AuthContext={AuthContext}>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </AuthProvider>
  )
}

export default App
