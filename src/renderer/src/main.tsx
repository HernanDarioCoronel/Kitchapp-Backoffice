import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { SidebarProvider } from './components/ui/sidebar'
import { TooltipProvider } from './components/ui/tooltip'
import { ThemeProvider } from 'next-themes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          {/* @ts-ignore --sidebar-width isn't recognized by TypeScript */}
          <SidebarProvider style={{ '--sidebar-width': '12.5rem' }}>
            <App />
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
)
