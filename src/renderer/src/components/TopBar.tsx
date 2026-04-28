import { JSX } from 'react'
import { Input } from './ui/input'

function TopBar(): JSX.Element {
  return (
    <div className="bg-slate-400 w-full p-1 flex justify-end">
      <Input placeholder="Buscar..." className="w-40 border-gray-600" />
    </div>
  )
}

export default TopBar
