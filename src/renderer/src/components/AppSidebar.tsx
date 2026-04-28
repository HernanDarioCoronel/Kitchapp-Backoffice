import {
  BadgeEuro,
  BottleWine,
  ChefHat,
  HandPlatter,
  LayoutDashboardIcon,
  Utensils
} from 'lucide-react'
import { JSX } from 'react'
import { Link, useLocation } from 'react-router'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter
} from '@/components/ui/sidebar'
import { Button } from './ui/button'

const navData = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboardIcon },
  { title: 'Dishes', url: '/dishes', icon: Utensils }, // Ejemplo con Tabler
  { title: 'Products', url: '/products', icon: BottleWine },
  { title: 'Orders', url: '/orders', icon: HandPlatter },
  { title: 'Kitchen', url: '/kitchen', icon: ChefHat },
  { title: 'TPV', url: '/tpv', icon: BadgeEuro }
]

function AppSidebar(): JSX.Element {
  const location = useLocation()
  return (
    <Sidebar>
      <SidebarHeader>Kitchapp</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {/* Gap para que no estén pegados */}
            {navData.map((item) => {
              const isActive = location.pathname === item.url

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="p-0 h-18 overflow-hidden border border-transparent data-[active=true]:border-amber-200"
                  >
                    <Link to={item.url} className="flex items-center w-full h-full">
                      <div
                        className={`
                            flex items-center justify-center w-12 h-full transition-colors 
                            ${
                              isActive
                                ? 'bg-amber-500 text-white' // Color cuando está activo
                                : 'bg-slate-100 text-slate-500'
                            }
                        `}
                      >
                        {item.icon && <item.icon size={20} />}
                      </div>

                      {/* Contenedor del Texto */}
                      <span
                        className={`
                            flex-1 px-3 font-medium transition-colors
                            ${isActive ? 'text-amber-900 bg-amber-50/50 h-full flex items-center' : 'text-slate-600'}
                        `}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        <Button variant={'outline'}>Logout</Button>v
        {window.electron?.process.versions.app || '1.0.0'}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
