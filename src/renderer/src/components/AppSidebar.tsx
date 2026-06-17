import {
  BadgeEuro,
  BottleWine,
  ChefHat,
  ClipboardCheck,
  Database,
  GlassWater,
  HandPlatter,
  LayoutDashboardIcon,
  LogOut,
  Map,
  ShoppingCart,
  Truck,
  Utensils,
  Warehouse
} from 'lucide-react'
import { JSX, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { useAuth } from '@renderer/pages/login/hooks/useAuth'

const navData = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboardIcon },
  { title: 'Dishes', url: '/dishes', icon: Utensils },
  { title: 'Products', url: '/products', icon: BottleWine },
  { title: 'Orders', url: '/orders', icon: HandPlatter },
  { title: 'Masters', url: '/masters', icon: Database },
  { title: 'Almacén', url: '/almacen', icon: Warehouse },
  { title: 'Proveedores', url: '/proveedores', icon: Truck },
  { title: 'Compras', url: '/compras', icon: ShoppingCart },
  { title: 'Kitchen', url: '/kitchen', icon: ChefHat },
  { title: 'Bar', url: '/bar', icon: GlassWater },
  { title: 'Table Map', url: '/table-map', icon: Map },
  { title: 'Fichaje', url: '/fichaje', icon: ClipboardCheck },
  { title: 'TPV', url: '/tpv', icon: BadgeEuro }
]

function AppSidebar(): JSX.Element {
  const [isClosed, setIsClosed] = useState<boolean>(false)
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center">
        <h1 className="text-xl font-bold group-data-[collapsible=icon]:hidden">Kitchapp</h1>
        <div className="flex w-full justify-end">
          <SidebarTrigger onClick={() => setIsClosed(!isClosed)} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {navData.map((item) => {
              const isActive = location.pathname === item.url
              return (
                <SidebarMenuItem key={item.title} className="h-8">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="p-0 overflow-hidden border border-accent bg-sidebar-item-background"
                  >
                    <Link
                      to={item.url}
                      className={`flex items-center w-full h-full m-0 gap-0!
                        ${
                          isClosed
                            ? isActive
                              ? 'bg-primary! text-foreground gap-2!'
                              : 'bg-muted! text-muted-foreground gap-2!'
                            : ''
                        }
                        `}
                    >
                      <div
                        className={`
                            flex items-center justify-center w-12 h-full transition-colors
                            ${
                              !isClosed
                                ? isActive
                                  ? 'bg-primary text-foreground'
                                  : 'bg-muted text-foreground'
                                : isActive
                                  ? 'text-foreground'
                                  : 'text-foreground'
                            }
                        `}
                      >
                        {item.icon && <item.icon size={20} />}
                      </div>
                      <span
                        className={`
                            flex-1 px-3 font-medium transition-colors
                            ${
                              isActive
                                ? 'text-foreground h-full flex items-center '
                                : 'text-foreground '
                            }
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
      <SidebarFooter className="pb-4">
        <SidebarMenuButton asChild onClick={logout}>
          <Link to={'/logout'} className="flex items-start w-full h-full">
            <div
              className={
                'flex items-center justify-center h-full transition-colors text-muted-foreground'
              }
            >
              <LogOut />
            </div>
            <span className={'flex-1 px-3 font-medium transition-colors text-muted-foreground'}>
              Logout
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
