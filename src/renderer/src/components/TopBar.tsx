import { JSX } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

function TopBar(): JSX.Element {
  const { theme, setTheme } = useTheme()
  return (
    <div className="bg-accent w-full p-1 flex justify-end">
      <Input placeholder="Buscar..." className="w-40 border-gray-600" />
      <Button
        variant="ghost"
        className="ml-2"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </Button>
    </div>
  )
}

export default TopBar
