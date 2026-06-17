import { JSX, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { RestaurantTable, TableOccupation, TableOccupationStatusEnum } from '@api/api'
import { toast } from 'sonner'
import { OrdersView } from './orderTypes'
import { useCreateTableOccupation, useCloseTableOccupation } from './hooks/useOrders'
import TableMapView from './components/TableMapView'
import OccupiedTableDialog from './components/OccupiedTableDialog'
import NewOrderView from './components/NewOrderView'
import OrdersListView from './components/OrdersListView'

interface OccupiedDialogState {
  table: RestaurantTable
  occupation: TableOccupation
}

function Orders(): JSX.Element {
  const navigate = useNavigate()
  const [view, setView] = useState<OrdersView>('map')
  const [activeOccupationId, setActiveOccupationId] = useState<string | null>(null)
  const [occupiedDialog, setOccupiedDialog] = useState<OccupiedDialogState | null>(null)

  const { mutateAsync: createOccupation, isPending: isCreatingOccupation } =
    useCreateTableOccupation()
  const { mutateAsync: closeOccupation, isPending: isClosing } = useCloseTableOccupation()

  async function handleFreeTableClick(table: RestaurantTable): Promise<void> {
    try {
      const occ = await createOccupation({
        table: { id: table.id as string },
        status: TableOccupationStatusEnum.Open,
        startedAt: new Date().toISOString()
      })
      setActiveOccupationId(occ.id as string)
      setView('new-order')
    } catch {
      toast.error('Error al abrir la mesa')
    }
  }

  function handleOccupiedTableClick(
    table: RestaurantTable,
    occupation: TableOccupation
  ): void {
    setOccupiedDialog({ table, occupation })
  }

  async function handleRelease(): Promise<void> {
    if (!occupiedDialog) return
    try {
      await closeOccupation(occupiedDialog.occupation.id as string)
      setOccupiedDialog(null)
    } catch {
      toast.error('Error al liberar la mesa')
    }
  }

  function handleNewOrder(): void {
    if (!occupiedDialog) return
    setActiveOccupationId(occupiedDialog.occupation.id as string)
    setOccupiedDialog(null)
    setView('new-order')
  }

  function handleViewOrders(): void {
    if (!occupiedDialog) return
    setActiveOccupationId(occupiedDialog.occupation.id as string)
    setOccupiedDialog(null)
    setView('orders-list')
  }

  function handleCharge(): void {
    if (!occupiedDialog) return
    navigate(`/tpv?occupationId=${occupiedDialog.occupation.id as string}`)
    setOccupiedDialog(null)
  }

  function goToMap(): void {
    setView('map')
    setActiveOccupationId(null)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background shrink-0">
        {view !== 'map' ? (
          <Button variant="ghost" size="sm" onClick={goToMap}>
            <ArrowLeft size={16} className="mr-1" />
            Mapa
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setView('orders-list')}>
            <ClipboardList size={16} className="mr-1" />
            Ver órdenes
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'map' && (
          <TableMapView
            onFreeTableClick={handleFreeTableClick}
            onOccupiedTableClick={handleOccupiedTableClick}
            isCreatingOccupation={isCreatingOccupation}
          />
        )}
        {view === 'new-order' && activeOccupationId && (
          <NewOrderView
            key={activeOccupationId}
            tableOccupationId={activeOccupationId}
            onOrderSent={goToMap}
          />
        )}
        {view === 'orders-list' && (
          <OrdersListView tableOccupationId={activeOccupationId ?? undefined} />
        )}
      </div>

      {occupiedDialog && (
        <OccupiedTableDialog
          table={occupiedDialog.table}
          occupation={occupiedDialog.occupation}
          open={true}
          onClose={() => setOccupiedDialog(null)}
          onRelease={handleRelease}
          onNewOrder={handleNewOrder}
          onViewOrders={handleViewOrders}
          onCharge={handleCharge}
          isReleasing={isClosing}
        />
      )}
    </div>
  )
}

export default Orders
