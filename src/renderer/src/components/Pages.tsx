import { useSetTitle } from '@renderer/hooks/use-set-title'
import Almacen from '@renderer/pages/almacen/Almacen'
import Bar from '@renderer/pages/bar/Bar'
import Compras from '@renderer/pages/compras/Compras'
import Dashboard from '@renderer/pages/dashboard/Dashboard'
import Dishes from '@renderer/pages/dishes/Dishes'
import Fichaje from '@renderer/pages/fichaje/Fichaje'
import Kitchen from '@renderer/pages/kitchen/Kitchen'
import Masters from '@renderer/pages/masters/Masters'
import NotFound from '@renderer/pages/notFound'
import Reservaciones from '@renderer/pages/reservaciones/Reservaciones'
import Orders from '@renderer/pages/orders/Orders'
import Products from '@renderer/pages/products/Products'
import Proveedores from '@renderer/pages/proveedores/Proveedores'
import TableMap from '@renderer/pages/table-map/TableMap'
import TPV from '@renderer/pages/tpv/TPV'
import { JSX, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'

const ROUTES: Record<string, string> = {
  '/': 'Dashboard',
  '/dishes': 'Dishes',
  '/products': 'Products',
  '/orders': 'Orders',
  '/masters': 'Masters',
  '/almacen': 'Almacén',
  '/proveedores': 'Proveedores',
  '/compras': 'Compras',
  '/kitchen': 'Kitchen',
  '/bar': 'Bar',
  '/table-map': 'Table Map',
  '/fichaje': 'Fichaje',
  '/tpv': 'TPV',
  '/reservaciones': 'Reservaciones'
}

function Pages(): JSX.Element {
  const { setTitle } = useSetTitle()
  const location = useLocation()

  useEffect(() => {
    const title = ROUTES[location.pathname] ? `Kitchapp - ${ROUTES[location.pathname]}` : 'Kitchapp'
    setTitle(title)
  }, [location.pathname])

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="/dishes" element={<Dishes />} />
      <Route path="/products" element={<Products />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/masters" element={<Masters />} />
      <Route path="/almacen" element={<Almacen />} />
      <Route path="/proveedores" element={<Proveedores />} />
      <Route path="/compras" element={<Compras />} />
      <Route path="/kitchen" element={<Kitchen />} />
      <Route path="/bar" element={<Bar />} />
      <Route path="/table-map" element={<TableMap />} />
      <Route path="/fichaje" element={<Fichaje />} />
      <Route path="/tpv" element={<TPV />} />
      <Route path="/reservaciones" element={<Reservaciones />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Pages
