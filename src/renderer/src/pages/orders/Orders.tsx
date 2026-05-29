import { JSX, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import { useDishes } from '@renderer/pages/dishes/hooks/useDishes'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import placeholderImg from '@resources/placeholder.jpg'
import { Check, ShoppingCart, Timer } from 'lucide-react'
import { UUID } from 'crypto'
import { Button } from '@renderer/components/ui/button'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return placeholderImg
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${API_BASE}/images/${imageUrl}`
}

type FilterMode = 'all' | 'selected' | 'unselected'

function Orders(): JSX.Element {
  const { data, isLoading, isError, error } = useDishes()
  const [cart, setCart] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<FilterMode>('all')
  const { query } = useSearch()

  function toggleCart(id: string): void {
    setCart((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function clearOrder(): void {
    setCart(new Set())
  }

  if (isLoading) return <div className="flex justify-center items-center h-full">Cargando...</div>
  if (isError)
    return (
      <div className="flex justify-center items-center h-full">
        Error: {(error as Error).message}
      </div>
    )

  const dishes = data ?? []

  let filtered = dishes

  if (query && query.trim() !== '') {
    const q = query.toLowerCase()
    filtered = filtered.filter(
      (dish) =>
        (dish.name ?? '').toLowerCase().includes(q) ||
        (dish.description ?? '').toLowerCase().includes(q)
    )
  }

  if (filter === 'selected') {
    filtered = filtered.filter((dish) => cart.has(dish.id as string))
  } else if (filter === 'unselected') {
    filtered = filtered.filter((dish) => !cart.has(dish.id as string))
  }

  const total = [...cart].reduce((sum, id) => {
    const dish = dishes.find((d) => d.id === id)
    return sum + (dish?.price ?? 0)
  }, 0)

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background border-b gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart size={20} />
          <span className="font-bold text-xl">${total.toFixed(2)}</span>
          <span className="text-muted-foreground text-sm">
            {cart.size} {cart.size === 1 ? 'plato' : 'platos'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-md border p-1">
            {(['all', 'selected', 'unselected'] as FilterMode[]).map((mode) => (
              <Button
                key={mode}
                variant={filter === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(mode)}
              >
                {mode === 'all' ? 'Todos' : mode === 'selected' ? 'Seleccionados' : 'No seleccionados'}
              </Button>
            ))}
          </div>
          <Button onClick={clearOrder} disabled={cart.size === 0}>
            Enviar orden
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 m-4 items-start">
        {filtered.length === 0 ? (
          <div className="flex justify-center items-center w-full pt-8 text-muted-foreground">
            No hay platos que coincidan
          </div>
        ) : (
          filtered.map((dish) => {
            const isSelected = cart.has(dish.id as string)
            return (
              <Card
                key={dish.id as UUID}
                className={`relative w-72 flex-none cursor-pointer select-none transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleCart(dish.id as string)}
              >
                <CardHeader>
                  <h3 className="w-full truncate text-lg font-bold">{dish.name}</h3>
                </CardHeader>
                <CardContent>
                  <div
                    className="mb-4 h-40 w-full rounded-md bg-center bg-cover relative"
                    style={{ backgroundImage: `url(${getImageUrl(dish.imageUrl)})` }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/30 rounded-md flex items-center justify-center">
                        <div className="bg-primary rounded-full p-2">
                          <Check size={24} className="text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="truncate text-muted-foreground text-sm">{dish.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-muted-foreground">
                      <Timer className="inline-block mr-1" size={16} />
                      <p className="text-sm">
                        {dish.prepTime}min
                      </p>
                    </div>
                    <p className="text-right font-bold text-xl">${dish.price!.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Orders
