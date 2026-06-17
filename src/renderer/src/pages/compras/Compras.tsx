import { JSX, useMemo, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { Button } from '@renderer/components/ui/button'
import { Badge } from '@renderer/components/ui/badge'
import DialogButton from '@renderer/components/DialogButton'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useDeletePurchaseOrder, usePurchaseOrders } from './hooks/useCompras'
import PurchaseOrderEditDialog from './components/PurchaseOrderEditDialog'
import { PurchaseOrder, PurchaseOrderStatusEnum } from '@api/api'

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PurchaseOrderStatusEnum, { label: string; className: string }> = {
  [PurchaseOrderStatusEnum.Draft]: {
    label: 'Borrador',
    className: 'bg-gray-100 text-gray-700 border-gray-300'
  },
  [PurchaseOrderStatusEnum.Sent]: {
    label: 'Enviado',
    className: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  [PurchaseOrderStatusEnum.Received]: {
    label: 'Recibido',
    className: 'bg-amber-100 text-amber-700 border-amber-300'
  },
  [PurchaseOrderStatusEnum.Verified]: {
    label: 'Verificado',
    className: 'bg-green-100 text-green-700 border-green-300'
  },
  [PurchaseOrderStatusEnum.Cancelled]: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-700 border-red-300'
  }
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-ES')
}

function formatMoney(value: number | undefined): string {
  if (value == null) return '-'
  return `${value.toFixed(2)} €`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function Compras(): JSX.Element {
  const { data } = usePurchaseOrders()
  const { mutate: remove } = useDeletePurchaseOrder()
  const { query } = useSearch()

  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<PurchaseOrder | null>(null)
  const [formKey, setFormKey] = useState(0)

  const rows = useMemo(() => {
    const base = data ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter(
      (o) =>
        (o.orderNumber ?? '').toLowerCase().includes(q) ||
        (o.supplier?.tradeName ?? '').toLowerCase().includes(q) ||
        (o.supplier?.businessName ?? '').toLowerCase().includes(q)
    )
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setFormKey((k) => k + 1)
    setOpenForm(true)
  }

  function openEdit(item: PurchaseOrder): void {
    setEditing(item)
    setFormKey((k) => k + 1)
    setOpenForm(true)
  }

  return (
    <div className="h-full flex flex-col gap-4 m-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Órdenes de compra</h1>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus /> Agregar
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº pedido</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Neto</TableHead>
            <TableHead>IVA</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => {
            const statusKey = item.status as PurchaseOrderStatusEnum | undefined
            const statusConfig = statusKey ? STATUS_CONFIG[statusKey] : null
            return (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{item.orderNumber ?? '-'}</TableCell>
                <TableCell>
                  {item.supplier?.tradeName ?? item.supplier?.businessName ?? '-'}
                </TableCell>
                <TableCell>
                  {statusConfig ? (
                    <Badge variant="outline" className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>{formatDate(item.dueDate)}</TableCell>
                <TableCell>{formatMoney(item.netAmount)}</TableCell>
                <TableCell>{formatMoney(item.taxAmount)}</TableCell>
                <TableCell className="font-medium">{formatMoney(item.total)}</TableCell>
                <TableCell className="max-w-[150px] truncate">{item.notes ?? '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => openEdit(item)}>
                      <Edit2 />
                    </Button>
                    <DialogButton
                      triggerButtonContent={<Trash2 className="text-destructive" />}
                      title="Eliminar orden de compra"
                      description="¿Estás seguro de que quieres eliminar esta orden de compra?"
                      type="destructive"
                      onConfirm={() => { if (item.id) remove(item.id) }}
                      confirmText="Eliminar"
                      cancelText="Cancelar"
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <PurchaseOrderEditDialog
        key={formKey}
        open={openForm}
        onOpenChange={setOpenForm}
        editing={editing}
      />
    </div>
  )
}

export default Compras
