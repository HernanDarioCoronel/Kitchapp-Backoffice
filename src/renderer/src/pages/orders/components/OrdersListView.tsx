import { UUID } from 'crypto'
import OrderCard from './OrderCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { OrderStatusEnum } from '@api/index'
import { JSX, useState } from 'react'
import { useOrders, useUpdateOrder } from '../hooks/useOrders'
import { STATUS_LABELS, type StatusFilter } from '../orderTypes'
import { toast } from 'sonner'

function OrdersListView(): JSX.Element {
  const { data: orders, isLoading, isError } = useOrders()
  const { mutateAsync: updateOrder } = useUpdateOrder()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')

  async function handleStatusChange(id: string, status: OrderStatusEnum): Promise<void> {
    try {
      await updateOrder({ id, payload: { status } })
      toast.success('Estado actualizado')
    } catch {
      toast.error('Error al actualizar el estado')
    }
  }

  if (isLoading)
    return <div className="flex justify-center items-center h-full">Cargando órdenes...</div>
  if (isError)
    return (
      <div className="flex justify-center items-center h-full">Error al cargar las órdenes</div>
    )

  const allOrders = orders ?? []

  const filteredOrders = allOrders.filter((o) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'active')
      return o.status === OrderStatusEnum.Waiting || o.status === OrderStatusEnum.InPreparation
    return o.status === statusFilter
  })

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background border-b gap-4">
        <span className="font-semibold text-sm text-muted-foreground">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'orden' : 'órdenes'}
        </span>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as StatusFilter)}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activas (espera + preparación)</SelectItem>
            <SelectItem value="all">Todas</SelectItem>
            {Object.values(OrderStatusEnum).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex justify-center items-center w-full pt-8 text-muted-foreground">
          No hay órdenes con ese estado
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id as UUID} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersListView
