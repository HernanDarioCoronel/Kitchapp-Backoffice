import Dashboard from '@renderer/pages/dashboard/Dashboard'
import { JSX } from 'react'
import { Route, Routes } from 'react-router'

function Pages(): JSX.Element {
  return (
    <Routes>
      <Route index path={'/'} element={<Dashboard />} />
    </Routes>
  )
}

export default Pages
