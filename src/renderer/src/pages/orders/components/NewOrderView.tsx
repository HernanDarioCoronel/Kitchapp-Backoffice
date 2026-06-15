import { UUID } from 'crypto'
import DishCard from './DishCard'
import ProductCard from './ProductCard'
import { Button } from '@renderer/components/ui/button'
import { ShoppingCart, Trash } from 'lucide-react'
import { useDishes } from '@renderer/pages/dishes/hooks/useDishes'
import { useProducts } from '@renderer/pages/products/hooks/useProducts'
import { ProductRequestType } from '@renderer/pages/products/api/products'
import { useCreateOrder } from '../hooks/useOrders'
import { useEmployees } from '@renderer/pages/masters/hooks/useMasters'
import { toast } from 'sonner'
import { JSX, useEffect, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import { FilterMode } from '../orderTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'

interface NewOrderViewProps {
  onOrderSent?: () => void
  tableOccupationId: string
}

function NewOrderView({ onOrderSent, tableOccupationId }: NewOrderViewProps): JSX.Element {
  const { data: dishes, isLoading: dishesLoading, isError: dishesError } = useDishes()
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError
  } = useProducts(ProductRequestType.PRODUCT)
  const { data: employees, isLoading: employeesLoading } = useEmployees()
  const { mutateAsync: createOrder, isPending } = useCreateOrder()

  const [cartDishes, setCartDishes] = useState<Map<string, number>>(new Map())
  const [cartProducts, setCartProducts] = useState<Map<string, number>>(new Map())
  const [filter, setFilter] = useState<FilterMode>('all')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    () => localStorage.getItem('lastEmployeeId') ?? ''
  )
  const { query } = useSearch()

  const allEmployees = (employees ?? []).filter((e) => e.isActive)

  // Validate stored employee ID when list loads
  useEffect(() => {
    if (allEmployees.length > 0 && selectedEmployeeId) {
      const found = allEmployees.some((e) => e.id === selectedEmployeeId)
      if (!found) setSelectedEmployeeId('')
    }
  }, [allEmployees.length])

  function handleEmployeeChange(id: string): void {
    setSelectedEmployeeId(id)
    localStorage.setItem('lastEmployeeId', id)
  }

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
    if (!selectedEmployeeId) {
      toast.error('Selecciona un empleado')
      return
    }

    const allDishesMap = new Map((dishes ?? []).map((d) => [d.id as string, d]))

    const orderDishes = [...cartDishes.entries()].map(([id, count]) => ({
      dishId: id,
      count,
      total: (allDishesMap.get(id)?.price ?? 0) * count
    }))

    const orderConsumables = [...cartProducts.entries()].map(([id, count]) => ({
      productId: id,
      count,
      total: count
    }))

    try {
      await createOrder({
        tableOccupationId,
        employeeId: selectedEmployeeId,
        orderDishes,
        orderConsumables
      })
      setCartDishes(new Map())
      setCartProducts(new Map())
      toast.success('Orden enviada correctamente')
      onOrderSent?.()
    } catch {
      toast.error('Error al enviar la orden')
    }
  }

  if (dishesLoading || productsLoading || employeesLoading)
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

  const canSend = totalSelected > 0 && !!selectedEmployeeId

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="sticky top-0 z-10 flex flex-col gap-2 px-4 py-3 bg-background border-b">
        {/* Row 1: cart summary + filters + send */}
        <div className="flex items-center justify-between gap-4">
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
            <Button onClick={handleSendOrder} disabled={!canSend || isPending}>
              {isPending ? 'Enviando...' : 'Enviar orden'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setCartDishes(new Map())
                setCartProducts(new Map())
              }}
              disabled={totalSelected === 0}
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>

        {/* Row 2: empleado */}
        <div className="flex items-center gap-3">
          <Select value={selectedEmployeeId} onValueChange={handleEmployeeChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Empleado" />
            </SelectTrigger>
            <SelectContent>
              {allEmployees.length === 0 ? (
                <SelectItem value="__none" disabled>
                  Sin empleados
                </SelectItem>
              ) : (
                allEmployees.map((e) => (
                  <SelectItem key={e.id as string} value={e.id as string}>
                    {e.fullName ?? '—'}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
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
