import { UUID } from 'crypto'
import DishCard from './DishCard'
import ProductCard from './ProductCard'
import { Button } from '@renderer/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useDishes } from '@renderer/pages/dishes/hooks/useDishes'
import { useProducts } from '@renderer/pages/products/hooks/useProducts'
import { ProductRequestType } from '@renderer/pages/products/api/products'
import { useCreateOrder } from '../hooks/useOrders'
import { toast } from 'sonner'
import { JSX, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import { FilterMode } from '../orderTypes'
import { OrderStatusEnum } from '@api/api'

function NewOrderView({ onOrderSent }: { onOrderSent?: () => void }): JSX.Element {
  const { data: dishes, isLoading: dishesLoading, isError: dishesError } = useDishes()
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError
  } = useProducts(ProductRequestType.PRODUCT)
  const { mutateAsync: createOrder, isPending } = useCreateOrder()
  const [cartDishes, setCartDishes] = useState<Map<string, number>>(new Map())
  const [cartProducts, setCartProducts] = useState<Map<string, number>>(new Map())
  const [filter, setFilter] = useState<FilterMode>('all')
  const { query } = useSearch()

  function incrementDish(id: string): void {
    setCartDishes((prev) => new Map(prev).set(id, (prev.get(id) ?? 0) + 1))
  }

  function decrementDish(id: string): void {
    setCartDishes((prev) => {
      const next = new Map(prev)
      const current = next.get(id) ?? 0
      if (current <= 1) next.delete(id)
      else next.set(id, current - 1)
      return next
    })
  }

  function incrementProduct(id: string): void {
    setCartProducts((prev) => new Map(prev).set(id, (prev.get(id) ?? 0) + 1))
  }

  function decrementProduct(id: string): void {
    setCartProducts((prev) => {
      const next = new Map(prev)
      const current = next.get(id) ?? 0
      if (current <= 1) next.delete(id)
      else next.set(id, current - 1)
      return next
    })
  }

  async function handleSendOrder(): Promise<void> {
    const orderDishes = [...cartDishes.entries()].map(([id, count]) => ({ dish: { id }, count }))
    const orderConsumableItems = [...cartProducts.entries()].map(([id, count]) => ({
      product: { id },
      count
    }))
    try {
      await createOrder({ status: OrderStatusEnum.Waiting, orderDishes, orderConsumableItems })
      setCartDishes(new Map())
      setCartProducts(new Map())
      toast.success('Orden enviada correctamente')
      onOrderSent?.()
    } catch {
      toast.error('Error al enviar la orden')
    }
  }

  if (dishesLoading || productsLoading)
    return <div className="flex justify-center items-center h-full">Cargando...</div>
  if (dishesError || productsError)
    return <div className="flex justify-center items-center h-full">Error al cargar los datos</div>

  const allDishes = dishes ?? []
  const allProducts = products ?? []
  const totalSelected =
    [...cartDishes.values()].reduce((a, b) => a + b, 0) +
    [...cartProducts.values()].reduce((a, b) => a + b, 0)

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

  const total = [...cartDishes.entries()].reduce((sum, [id, count]) => {
    const dish = allDishes.find((d) => d.id === id)
    return sum + (dish?.price ?? 0) * count
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
          <Button onClick={handleSendOrder} disabled={totalSelected === 0 || isPending}>
            {isPending ? 'Enviando...' : 'Enviar orden'}
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
                    count={cartDishes.get(dish.id as string) ?? 0}
                    onIncrement={() => incrementDish(dish.id as string)}
                    onDecrement={() => decrementDish(dish.id as string)}
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
                    count={cartProducts.get(product.id as string) ?? 0}
                    onIncrement={() => incrementProduct(product.id as string)}
                    onDecrement={() => decrementProduct(product.id as string)}
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

export default NewOrderView
