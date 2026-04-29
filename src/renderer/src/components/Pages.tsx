import { useSetTitle } from '@renderer/hooks/use-set-title'
import Dashboard from '@renderer/pages/dashboard/Dashboard'
import Dishes from '@renderer/pages/dishes/Dishes'
import { JSX, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'

const ROUTES: Record<string, string> = {
  '/': 'Dashboard',
  '/dishes': 'Dishes'
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
    </Routes>
  )
}

export default Pages
