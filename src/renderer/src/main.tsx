import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { SidebarProvider } from './components/ui/sidebar'
import { TooltipProvider } from './components/ui/tooltip'
import AppSidebar from './components/AppSidebar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <App />
        </SidebarProvider>
      </TooltipProvider>
    </HashRouter>
  </StrictMode>
)
