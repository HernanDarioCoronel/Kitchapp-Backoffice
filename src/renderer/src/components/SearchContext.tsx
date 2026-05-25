import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'

type SearchContextType = {
  query: string
  setQuery: (q: string) => void
  pathname: string
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('')
  const location = useLocation()

  // Clear search when route changes
  useEffect(() => {
    setQuery('')
  }, [location.pathname])

  return (
    <SearchContext.Provider value={{ query, setQuery, pathname: location.pathname }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}

export default SearchContext
