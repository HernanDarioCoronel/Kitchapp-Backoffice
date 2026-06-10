import { useSetTitle } from '@renderer/hooks/use-set-title'
import Dashboard from '@renderer/pages/dashboard/Dashboard'
import Dishes from '@renderer/pages/dishes/Dishes'
import Kitchen from '@renderer/pages/kitchen/Kitchen'
import Masters from '@renderer/pages/masters/Masters'
import NotFound from '@renderer/pages/notFound'
import Orders from '@renderer/pages/orders/Orders'
import Products from '@renderer/pages/products/Products'
import { JSX, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'

const ROUTES: Record<string, string> = {
  '/': 'Dashboard',
  '/dishes': 'Dishes',
  '/products': 'Products',
  '/orders': 'Orders',
  '/masters': 'Masters',
  '/kitchen': 'Kitchen'
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
      <Route index path={ROUTES['/']} element={<Dashboard />} />
      <Route path={ROUTES['/dishes']} element={<Dishes />} />
      <Route path={ROUTES['/products']} element={<Products />} />
      <Route path={ROUTES['/orders']} element={<Orders />} />
      <Route path={ROUTES['/masters']} element={<Masters />} />
      <Route path={ROUTES['/kitchen']} element={<Kitchen />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Pages
