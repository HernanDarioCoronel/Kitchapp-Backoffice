import { useState } from 'react'

interface Props {
  isDark: boolean
  toggle: () => void
}

function useTheme(): Props {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = (): void => {
    document.documentElement.classList.toggle('dark')
    setIsDark((prev) => !prev)
  }

  return { isDark, toggle }
}

export default useTheme
