import { JSX } from 'react'
import { ClipboardList, Plus, Unlock } from 'lucide-react'
import { RestaurantTable, TableOccupation, TableOccupationStatusEnum } from '@api/api'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'

interface OccupiedTableDialogProps {
  table: RestaurantTable
  occupation: TableOccupation
  open: boolean
  onClose: () => void
  onRelease: () => void
  onNewOrder: () => void
  onViewOrders: () => void
  isReleasing: boolean
}

const STATUS_LABELS: Partial<Record<TableOccupationStatusEnum, string>> = {
  [TableOccupationStatusEnum.Open]: 'Abierta',
  [TableOccupationStatusEnum.Occupied]: 'Ocupada',
  [TableOccupationStatusEnum.Unavaliable]: 'Reservada'
}

function OccupiedTableDialog({
  table,
  occupation,
  open,
  onClose,
  onRelease,
  onNewOrder,
  onViewOrders,
  isReleasing
}: OccupiedTableDialogProps): JSX.Element {
  const statusLabel =
    STATUS_LABELS[occupation.status as TableOccupationStatusEnum] ?? occupation.status ?? '—'

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Mesa {table.tableNumber ?? '?'}</DialogTitle>
          <DialogDescription>Estado: {statusLabel}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button onClick={onNewOrder} className="w-full">
            <Plus size={16} className="mr-2" />
            Tomar otra orden
          </Button>
          <Button onClick={onViewOrders} variant="outline" className="w-full">
            <ClipboardList size={16} className="mr-2" />
            Ver órdenes
          </Button>
          <Button
            onClick={onRelease}
            variant="destructive"
            className="w-full"
            disabled={isReleasing}
          >
            <Unlock size={16} className="mr-2" />
            {isReleasing ? 'Liberando...' : 'Liberar mesa'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OccupiedTableDialog
