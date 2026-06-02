import { type Order, OrderStatusEnum } from '@api/api'
import { Badge } from '@renderer/components/ui/badge'
import { Card, CardContent } from '@renderer/components/ui/card'
import { JSX } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { STATUS_COLORS, STATUS_LABELS } from '../orderTypes'

function OrderCard({
  order,
  onStatusChange
}: {
  order: Order
  onStatusChange: (id: string, status: OrderStatusEnum) => void
}): JSX.Element {
  const status = order.status as OrderStatusEnum
  const dishCount = order.orderDishes ? [...order.orderDishes].length : 0
  const consumableCount = order.orderConsumableItems ? [...order.orderConsumableItems].length : 0
  const total = [
    ...Array.from(order.orderDishes ?? []).map((d) => d.total ?? 0),
    ...Array.from(order.orderConsumableItems ?? []).map((c) => c.total ?? 0)
  ].reduce((a, b) => a + b, 0)

  const createdAt = order.createdAt ? new Date(order.createdAt) : null
  const timeStr = createdAt
    ? createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-xs text-muted-foreground font-mono truncate">
              #{(order.id ?? '').slice(0, 8)}
            </p>
            <p className="text-sm text-muted-foreground">{timeStr}</p>
            <p className="text-sm mt-1">
              {dishCount > 0 && (
                <span>
                  {dishCount} {dishCount === 1 ? 'plato' : 'platos'}
                </span>
              )}
              {dishCount > 0 && consumableCount > 0 && <span className="mx-1">·</span>}
              {consumableCount > 0 && (
                <span>
                  {consumableCount} {consumableCount === 1 ? 'consumible' : 'consumibles'}
                </span>
              )}
              {dishCount === 0 && consumableCount === 0 && (
                <span className="text-muted-foreground">Sin ítems</span>
              )}
            </p>
            {total > 0 && <p className="font-bold text-lg">${total.toFixed(2)}</p>}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge className={`border text-xs ${STATUS_COLORS[status] ?? ''}`}>
              {STATUS_LABELS[status] ?? status}
            </Badge>
            <Select
              value={status}
              onValueChange={(val) => {
                if (order.id) onStatusChange(order.id, val as OrderStatusEnum)
              }}
            >
              <SelectTrigger className="w-44 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OrderStatusEnum).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderCard
