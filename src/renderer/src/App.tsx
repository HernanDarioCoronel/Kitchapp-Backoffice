import AppSidebar from './components/AppSidebar'
import Footer from './components/Footer'
import Pages from './components/Pages'
import TopBar from './components/TopBar'
import { AuthProvider } from './pages/login/AuthContext'
import AuthContext from './pages/login/context/AuthContext'
import { useAuth } from './pages/login/hooks/useAuth'
import Login from './pages/login/Login'

function AppContent(): React.JSX.Element {
  const { isAuthenticated } = useAuth()

  // Si no está autenticado, solo mostramos la pantalla de Login
  if (!isAuthenticated) {
    return <Login />
  }

  // Si está autenticado, mostramos el layout de la aplicación
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
      <AppContent />
    </AuthProvider>
  )
}

export default App
