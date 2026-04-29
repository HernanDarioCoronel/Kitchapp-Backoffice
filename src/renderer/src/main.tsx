import './assets/main.css'

import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { SidebarProvider } from './components/ui/sidebar'
import { TooltipProvider } from './components/ui/tooltip'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextType } from './pages/login/types/auth'
import { AuthProvider } from './pages/login/AuthContext'

const queryClient = new QueryClient()
const AuthContext = createContext<AuthContextType | undefined>(undefined)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <AuthProvider AuthContext={AuthContext}>
              {/* @ts-ignore --sidebar-width isn't recognized by TypeScript */}
              <SidebarProvider style={{ '--sidebar-width': '12.5rem' }}>
                <App />
              </SidebarProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HashRouter>
  </StrictMode>
)
