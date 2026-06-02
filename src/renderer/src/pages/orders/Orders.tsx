import { JSX, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import { useDishes } from '@renderer/pages/dishes/hooks/useDishes'
import { useProducts } from '@renderer/pages/products/hooks/useProducts'
import { ProductRequestType } from '@renderer/pages/products/api/products'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import placeholderImg from '@resources/placeholder.jpg'
import { Check, Package, ShoppingCart, Timer } from 'lucide-react'
import { UUID } from 'crypto'
import { Button } from '@renderer/components/ui/button'
import { Badge } from '@renderer/components/ui/badge'
import type { Dish, Product } from '@api/api'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return placeholderImg
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${API_BASE}/images/${imageUrl}`
}

type FilterMode = 'all' | 'dishes' | 'products' | 'selected'

function DishCard({
  dish,
  selected,
  onToggle
}: {
  dish: Dish
  selected: boolean
  onToggle: () => void
}): JSX.Element {
  return (
    <Card
      className={`relative w-72 flex-none cursor-pointer select-none transition-all ${selected ? 'ring-2 ring-primary' : ''}`}
      style={{ borderColor: dish.dishCategory?.color }}
      onClick={onToggle}
    >
      <CardHeader>
        <h3 className="w-full truncate text-lg font-bold">{dish.name}</h3>
        {dish.dishCategory && (
          <Badge
            className="w-fit border"
            style={{
              borderColor: dish.dishCategory.color,
              backgroundColor: `${dish.dishCategory.color}20`,
              color: dish.dishCategory.color
            }}
          >
            {dish.dishCategory.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="mb-4 h-40 w-full rounded-md bg-center bg-cover relative"
          style={{ backgroundImage: `url(${getImageUrl(dish.imageUrl)})` }}
        >
          {selected && (
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
            <p className="text-sm">{dish.prepTime}min</p>
          </div>
          <p className="text-right font-bold text-xl">${dish.price!.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductCard({
  product,
  selected,
  onToggle
}: {
  product: Product
  selected: boolean
  onToggle: () => void
}): JSX.Element {
  const categoryColor = product.category?.color
  return (
    <Card
      className={`relative w-72 flex-none cursor-pointer select-none transition-all ${selected ? 'ring-2 ring-primary' : ''}`}
      style={{ borderColor: categoryColor }}
      onClick={onToggle}
    >
      <CardHeader>
        <h3 className="w-full truncate text-lg font-bold">{product.name}</h3>
        {product.category && (
          <Badge
            className="w-fit border"
            style={{
              borderColor: categoryColor,
              backgroundColor: `${categoryColor}20`,
              color: categoryColor
            }}
          >
            {product.category.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-40 w-full rounded-md bg-muted flex items-center justify-center relative">
          <Package size={48} className="text-muted-foreground" />
          {selected && (
            <div className="absolute inset-0 bg-primary/30 rounded-md flex items-center justify-center">
              <div className="bg-primary rounded-full p-2">
                <Check size={24} className="text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
        <p className="truncate text-muted-foreground text-sm">
          {product.sku && <span className="font-mono">{product.sku}</span>}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">{product.unitType?.abbreviation ?? '—'}</p>
          {product.caloriesPer100g != null && (
            <p className="text-right font-bold text-xl">{product.caloriesPer100g} kcal</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Orders(): JSX.Element {
  const { data: dishes, isLoading: dishesLoading, isError: dishesError } = useDishes()
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError
  } = useProducts(ProductRequestType.PRODUCT)
  const [cartDishes, setCartDishes] = useState<Set<string>>(new Set())
  const [cartProducts, setCartProducts] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<FilterMode>('all')
  const { query } = useSearch()

  function toggleDish(id: string): void {
    setCartDishes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleProduct(id: string): void {
    setCartProducts((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearOrder(): void {
    setCartDishes(new Set())
    setCartProducts(new Set())
  }

  if (dishesLoading || productsLoading)
    return <div className="flex justify-center items-center h-full">Cargando...</div>
  if (dishesError || productsError)
    return <div className="flex justify-center items-center h-full">Error al cargar los datos</div>

  const allDishes = dishes ?? []
  const allProducts = products ?? []
  const totalSelected = cartDishes.size + cartProducts.size

  const q = query?.trim().toLowerCase() ?? ''

  let filteredDishes = allDishes.filter(
    (d) =>
      !q ||
      (d.name ?? '').toLowerCase().includes(q) ||
      (d.description ?? '').toLowerCase().includes(q)
  )
  let filteredProducts = allProducts.filter(
    (p) =>
      !q ||
      (p.name ?? '').toLowerCase().includes(q) ||
      (p.sku ?? '').toLowerCase().includes(q) ||
      (p.category?.name ?? '').toLowerCase().includes(q)
  )

  if (filter === 'dishes') {
    filteredProducts = []
  } else if (filter === 'products') {
    filteredDishes = []
  } else if (filter === 'selected') {
    filteredDishes = filteredDishes.filter((d) => cartDishes.has(d.id as string))
    filteredProducts = filteredProducts.filter((p) => cartProducts.has(p.id as string))
  }

  const total = [...cartDishes].reduce((sum, id) => {
    const dish = allDishes.find((d) => d.id === id)
    return sum + (dish?.price ?? 0)
  }, 0)

  const isEmpty = filteredDishes.length === 0 && filteredProducts.length === 0

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background border-b gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart size={20} />
          <span className="font-bold text-xl">${total.toFixed(2)}</span>
          <span className="text-muted-foreground text-sm">
            {totalSelected} {totalSelected === 1 ? 'ítem' : 'ítems'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-md border p-1">
            {(
              [
                ['all', 'Todos'],
                ['dishes', 'Platos'],
                ['products', 'Productos'],
                ['selected', 'Seleccionados']
              ] as [FilterMode, string][]
            ).map(([mode, label]) => (
              <Button
                key={mode}
                variant={filter === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(mode)}
              >
                {label}
              </Button>
            ))}
          </div>
          <Button onClick={clearOrder} disabled={totalSelected === 0}>
            Enviar orden
          </Button>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex justify-center items-center w-full pt-8 text-muted-foreground">
          No hay ítems que coincidan
        </div>
      ) : (
        <>
          {filteredDishes.length > 0 && (
            <div className="px-4 pt-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Platos
              </h2>
              <div className="flex flex-wrap gap-4 items-start">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.id as UUID}
                    dish={dish}
                    selected={cartDishes.has(dish.id as string)}
                    onToggle={() => toggleDish(dish.id as string)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="px-4 pt-6 pb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Consumibles
              </h2>
              <div className="flex flex-wrap gap-4 items-start">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id as UUID}
                    product={product}
                    selected={cartProducts.has(product.id as string)}
                    onToggle={() => toggleProduct(product.id as string)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Orders
