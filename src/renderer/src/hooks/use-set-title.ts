import { useState } from 'react'

interface Props {
  title: string
  setTitle: (title: string) => void
}

export function useSetTitle(): Props {
  const [title, setTitle] = useState<string>(document.title)

  const updateTitle = (title: string): void => {
    const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1)
    document.title = capitalizedTitle
    setTitle(capitalizedTitle)
  }

  return { title, setTitle: updateTitle }
}
