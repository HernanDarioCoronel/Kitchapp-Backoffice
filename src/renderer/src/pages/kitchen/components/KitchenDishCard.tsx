import { OrderDishStatusEnum } from '@api/api'
import type { OrderDish } from '@api/api'
import { JSX, useEffect, useState } from 'react'

export const ORDER_COLORS: string[] = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#b91c1c',
  '#c2410c',
  '#b45309',
  '#a16207',
  '#4d7c0f',
  '#15803d',
  '#047857',
  '#0f766e',
  '#0e7490',
  '#0369a1',
  '#1d4ed8',
  '#4338ca',
  '#6d28d9'
]

const STATUS_LABELS: Record<string, string> = {
  [OrderDishStatusEnum.Waiting]: 'En espera',
  [OrderDishStatusEnum.InPreparation]: 'Preparando',
  [OrderDishStatusEnum.Done]: 'Listo'
}

const STATUS_RING: Record<string, string> = {
  [OrderDishStatusEnum.Waiting]: 'ring-yellow-400',
  [OrderDishStatusEnum.InPreparation]: 'ring-blue-400',
  [OrderDishStatusEnum.Done]: 'ring-green-400'
}

function ElapsedTimer({ createdAt }: { createdAt: string }): JSX.Element {
  const [elapsed, setElapsed] = useState<number>(
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  )

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [createdAt])

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60

  const isLate = elapsed >= 600
  const formatted =
    h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return (
    <span className={`font-mono text-xs font-semibold tabular-nums ${isLate ? 'text-red-500' : 'text-muted-foreground'}`}>
      {formatted}
    </span>
  )
}

interface KitchenDishCardProps {
  dish: OrderDish
  orderId: string
  orderColor: string
  tableNumber?: number
  orderIndex: number
  createdAt: string
  onAdvance: (orderId: string, dishId: string, currentStatus: OrderDishStatusEnum) => void
  isUpdating: boolean
}

function KitchenDishCard({
  dish,
  orderId,
  orderColor,
  tableNumber,
  orderIndex,
  createdAt,
  onAdvance,
  isUpdating
}: KitchenDishCardProps): JSX.Element {
  const status = dish.status ?? OrderDishStatusEnum.Waiting

  function handleClick(): void {
    if (isUpdating || !dish.id) return
    onAdvance(orderId, dish.id, status)
  }

  return (
    <div
      onClick={handleClick}
      className={`
        relative flex flex-col rounded-lg overflow-hidden border bg-card
        shadow-sm cursor-pointer select-none transition-all duration-150
        hover:shadow-md active:scale-[0.98]
        ring-2 ${STATUS_RING[status]}
        ${isUpdating ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      {/* Color bar header */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: orderColor }}
      />

      {/* Card body */}
      <div className="flex flex-col gap-1.5 p-3">
        {/* Order badge + timer */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded text-white"
            style={{ backgroundColor: orderColor }}
          >
            #{orderIndex + 1}
            {tableNumber != null ? ` · Mesa ${tableNumber}` : ''}
          </span>
          <ElapsedTimer createdAt={createdAt} />
        </div>

        {/* Dish name */}
        <p className="font-semibold text-sm leading-tight line-clamp-2">
          {dish.dish?.name ?? '—'}
        </p>

        {/* Count */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            ×{dish.count ?? 1}
          </span>
          <span
            className={`
              text-xs px-2 py-0.5 rounded-full font-medium
              ${status === OrderDishStatusEnum.Waiting ? 'bg-yellow-100 text-yellow-800' : ''}
              ${status === OrderDishStatusEnum.InPreparation ? 'bg-blue-100 text-blue-800' : ''}
              ${status === OrderDishStatusEnum.Done ? 'bg-green-100 text-green-800' : ''}
            `}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
      </div>

      {/* Pulse overlay while updating */}
      {isUpdating && (
        <div className="absolute inset-0 bg-background/40 animate-pulse rounded-lg" />
      )}
    </div>
  )
}

export default KitchenDishCard
