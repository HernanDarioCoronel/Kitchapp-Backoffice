import { OrderDishStatusEnum, OrderStatusEnum } from '@api/api'
import type { Order, OrderDish } from '@api/api'
import { JSX, useState } from 'react'
import { useOrders, useUpdateOrderDish } from '../orders/hooks/useOrders'
import KitchenDishCard, { ORDER_COLORS } from './components/KitchenDishCard'
import { toast } from 'sonner'

interface FlatDish {
  dish: OrderDish
  orderId: string
  orderColor: string
  orderIndex: number
  tableNumber?: number
  createdAt: string
}

function buildColorMap(orders: Order[]): Map<string, string> {
  const map = new Map<string, string>()
  orders.forEach((order, idx) => {
    if (order.id) {
      map.set(order.id, ORDER_COLORS[idx % ORDER_COLORS.length])
    }
  })
  return map
}

function flattenDishes(orders: Order[], colorMap: Map<string, string>): FlatDish[] {
  const result: FlatDish[] = []

  orders.forEach((order, orderIndex) => {
    if (!order.id || !order.orderDishes) return
    const dishes = Array.from(order.orderDishes)
    dishes.forEach((dish) => {
      if (dish.status === OrderDishStatusEnum.Done) return
      result.push({
        dish,
        orderId: order.id as string,
        orderColor: colorMap.get(order.id as string) ?? ORDER_COLORS[0],
        orderIndex,
        tableNumber: order.tableOccupation?.table?.tableNumber,
        createdAt: order.createdAt ?? new Date().toISOString()
      })
    })
  })

  return result
}

function Kitchen(): JSX.Element {
  const { data: orders, isLoading, isError } = useOrders()
  const { mutateAsync: updateDish } = useUpdateOrderDish()
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        Cargando cocina...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full text-destructive">
        Error al cargar las órdenes
      </div>
    )
  }

  const allOrders = orders ?? []

  // Only show active orders (WAITING or IN_PREPARATION at order level)
  const activeOrders = allOrders
    .filter(
      (o) => o.status === OrderStatusEnum.Waiting || o.status === OrderStatusEnum.InPreparation
    )
    .sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return ta - tb
    })

  const colorMap = buildColorMap(activeOrders)
  const flatDishes = flattenDishes(activeOrders, colorMap)

  async function handleAdvance(
    orderId: string,
    dishId: string,
    currentStatus: OrderDishStatusEnum
  ): Promise<void> {
    const nextStatus =
      currentStatus === OrderDishStatusEnum.Waiting
        ? OrderDishStatusEnum.InPreparation
        : OrderDishStatusEnum.Done

    setUpdatingIds((prev) => new Set(prev).add(dishId))
    try {
      await updateDish({ orderId, dishId, payload: { status: nextStatus } })
      if (nextStatus === OrderDishStatusEnum.Done) {
        toast.success('Plato marcado como listo')
      }
    } catch {
      toast.error('Error al actualizar el estado del plato')
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(dishId)
        return next
      })
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <h2 className="font-semibold text-base">
          Cocina
          {flatDishes.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              {flatDishes.length} {flatDishes.length === 1 ? 'plato pendiente' : 'platos pendientes'}
            </span>
          )}
        </h2>
        <span className="text-xs text-muted-foreground">
          Toca una tarjeta para avanzar su estado
        </span>
      </div>

      {/* Grid */}
      {flatDishes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          No hay platos pendientes
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {flatDishes.map((fd) => (
              <KitchenDishCard
                key={`${fd.orderId}-${fd.dish.id}`}
                dish={fd.dish}
                orderId={fd.orderId}
                orderColor={fd.orderColor}
                tableNumber={fd.tableNumber}
                orderIndex={fd.orderIndex}
                createdAt={fd.createdAt}
                onAdvance={handleAdvance}
                isUpdating={updatingIds.has(fd.dish.id ?? '')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Kitchen
