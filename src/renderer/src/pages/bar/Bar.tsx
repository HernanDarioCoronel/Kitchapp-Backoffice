import { OrderStatusEnum } from '@api/api'
import type { Order, OrderConsumableItem } from '@api/api'
import { JSX, useState } from 'react'
import { useOrders, useUpdateOrderConsumable } from '../orders/hooks/useOrders'
import { toast } from 'sonner'

interface FlatItem {
  item: OrderConsumableItem
  orderId: string
  orderIndex: number
  tableNumber?: number
  createdAt: string
}

function flattenConsumables(orders: Order[]): FlatItem[] {
  const result: FlatItem[] = []
  orders.forEach((order, orderIndex) => {
    if (!order.id || !order.orderConsumableItems) return
    Array.from(order.orderConsumableItems).forEach((item) => {
      if (item.delivered) return
      result.push({
        item,
        orderId: order.id as string,
        orderIndex,
        tableNumber: order.tableOccupation?.table?.tableNumber,
        createdAt: order.createdAt ?? new Date().toISOString()
      })
    })
  })
  return result
}

function Bar(): JSX.Element {
  const { data: orders, isLoading, isError } = useOrders()
  const { mutateAsync: updateConsumable } = useUpdateOrderConsumable()
  const [deliveringIds, setDeliveringIds] = useState<Set<string>>(new Set())

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        Cargando barra...
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

  const activeOrders = (orders ?? [])
    .filter(
      (o) => o.status === OrderStatusEnum.Waiting || o.status === OrderStatusEnum.InPreparation
    )
    .sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return ta - tb
    })

  const flatItems = flattenConsumables(activeOrders)

  async function handleDeliver(orderId: string, itemId: string): Promise<void> {
    setDeliveringIds((prev) => new Set(prev).add(itemId))
    try {
      await updateConsumable({ orderId, itemId, payload: { delivered: true } })
      toast.success('Producto marcado como entregado')
    } catch {
      toast.error('Error al marcar como entregado')
    } finally {
      setDeliveringIds((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <h2 className="font-semibold text-base">
          Barra
          {flatItems.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              {flatItems.length} {flatItems.length === 1 ? 'producto pendiente' : 'productos pendientes'}
            </span>
          )}
        </h2>
        <span className="text-xs text-muted-foreground">Toca una tarjeta para marcar como entregado</span>
      </div>

      {flatItems.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          No hay productos pendientes de entrega
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {flatItems.map((fi) => {
              const id = fi.item.id ?? ''
              const isDelivering = deliveringIds.has(id)
              return (
                <div
                  key={`${fi.orderId}-${id}`}
                  onClick={() => !isDelivering && id && handleDeliver(fi.orderId, id)}
                  className={`
                    relative flex flex-col rounded-lg overflow-hidden border bg-card
                    shadow-sm cursor-pointer select-none transition-all duration-150
                    hover:shadow-md active:scale-[0.98] ring-2 ring-orange-400
                    ${isDelivering ? 'opacity-60 pointer-events-none' : ''}
                  `}
                >
                  <div className="h-2 w-full bg-orange-400" />
                  <div className="flex flex-col gap-1.5 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white bg-orange-400">
                        #{fi.orderIndex + 1}
                        {fi.tableNumber != null ? ` · Mesa ${fi.tableNumber}` : ''}
                      </span>
                    </div>
                    <p className="font-semibold text-sm leading-tight line-clamp-2">
                      {fi.item.product?.name ?? '—'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">×{fi.item.count ?? 1}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-800">
                        Pendiente
                      </span>
                    </div>
                  </div>
                  {isDelivering && (
                    <div className="absolute inset-0 bg-background/40 animate-pulse rounded-lg" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Bar
