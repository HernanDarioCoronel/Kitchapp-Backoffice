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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Badge } from '@renderer/components/ui/badge'
import DialogButton from '@renderer/components/DialogButton'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { Reservation, ReservationStatusEnum } from '@api/api'
import { useTables } from '@renderer/pages/masters/hooks/useMasters'
import {
  useCreateReservacion,
  useDeleteReservacion,
  useReservaciones,
  useUpdateReservacion
} from './hooks/useReservaciones'

const STATUS_LABELS: Record<ReservationStatusEnum, string> = {
  [ReservationStatusEnum.Confirmed]: 'Confirmada',
  [ReservationStatusEnum.Pending]: 'Pendiente',
  [ReservationStatusEnum.Cancelled]: 'Cancelada',
  [ReservationStatusEnum.Arrived]: 'Llegó'
}

const STATUS_VARIANTS: Record<
  ReservationStatusEnum,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [ReservationStatusEnum.Confirmed]: 'default',
  [ReservationStatusEnum.Pending]: 'outline',
  [ReservationStatusEnum.Cancelled]: 'destructive',
  [ReservationStatusEnum.Arrived]: 'secondary'
}

interface ReservationForm {
  customerName: string
  customerPhone: string
  numGuests: string
  reservationDate: string
  tableId: string
  status: ReservationStatusEnum
  notes: string
}

const EMPTY_FORM: ReservationForm = {
  customerName: '',
  customerPhone: '',
  numGuests: '2',
  reservationDate: '',
  tableId: '',
  status: ReservationStatusEnum.Pending,
  notes: ''
}

function formatDate(iso?: string): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function Reservaciones(): JSX.Element {
  const { data } = useReservaciones()
  const { data: tables } = useTables()
  const { mutate: create } = useCreateReservacion()
  const { mutate: update } = useUpdateReservacion()
  const { mutate: remove } = useDeleteReservacion()
  const { query } = useSearch()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Reservation | null>(null)
  const [form, setForm] = useState<ReservationForm>(EMPTY_FORM)

  const rows = useMemo(() => {
    const base = data ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter(
      (r) =>
        (r.customerName ?? '').toLowerCase().includes(q) ||
        (r.customerPhone ?? '').toLowerCase().includes(q)
    )
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function openEdit(item: Reservation): void {
    setEditing(item)
    const dateLocal = item.reservationDate
      ? new Date(item.reservationDate).toISOString().slice(0, 16)
      : ''
    setForm({
      customerName: item.customerName ?? '',
      customerPhone: item.customerPhone ?? '',
      numGuests: String(item.numGuests ?? 2),
      reservationDate: dateLocal,
      tableId: item.restaurantTables?.id ?? '',
      status: (item.status as ReservationStatusEnum) ?? ReservationStatusEnum.Pending,
      notes: item.notes ?? ''
    })
    setOpen(true)
  }

  function handleSubmit(): void {
    const selectedTable = tables?.find((t) => t.id === form.tableId)
    const payload: Reservation = {
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      numGuests: Number(form.numGuests),
      reservationDate: form.reservationDate ? new Date(form.reservationDate).toISOString() : undefined,
      restaurantTables: selectedTable ?? undefined,
      status: form.status,
      notes: form.notes || undefined
    }
    if (editing?.id) {
      update({ id: editing.id, payload })
    } else {
      create(payload)
    }
    setOpen(false)
  }

  return (
    <div className="h-full flex flex-col gap-4 m-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reservaciones</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus /> Nueva reservación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar reservación' : 'Nueva reservación'}</DialogTitle>
              <DialogDescription>Datos de la reservación</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Nombre del cliente</Label>
                <Input
                  value={form.customerName}
                  onChange={(e) => setForm((s) => ({ ...s, customerName: e.target.value }))}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="grid gap-1">
                <Label>Teléfono</Label>
                <Input
                  value={form.customerPhone}
                  onChange={(e) => setForm((s) => ({ ...s, customerPhone: e.target.value }))}
                  placeholder="+34 600 000 000"
                />
              </div>
              <div className="grid gap-1">
                <Label>Número de comensales</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.numGuests}
                  onChange={(e) => setForm((s) => ({ ...s, numGuests: e.target.value }))}
                />
              </div>
              <div className="grid gap-1">
                <Label>Fecha y hora</Label>
                <Input
                  type="datetime-local"
                  value={form.reservationDate}
                  onChange={(e) => setForm((s) => ({ ...s, reservationDate: e.target.value }))}
                />
              </div>
              <div className="grid gap-1">
                <Label>Mesa</Label>
                <Select
                  value={form.tableId}
                  onValueChange={(v) => setForm((s) => ({ ...s, tableId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {(tables ?? []).map((t) => (
                      <SelectItem key={t.id} value={t.id ?? ''}>
                        Mesa {t.tableNumber} (cap. {t.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Estado</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((s) => ({ ...s, status: v as ReservationStatusEnum }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ReservationStatusEnum).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Notas</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
                  placeholder="Notas adicionales"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>{editing ? 'Guardar' : 'Crear'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Comensales</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Mesa</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{item.customerName}</TableCell>
              <TableCell>{item.customerPhone ?? '-'}</TableCell>
              <TableCell>{item.numGuests ?? '-'}</TableCell>
              <TableCell>{formatDate(item.reservationDate)}</TableCell>
              <TableCell>
                {item.restaurantTables ? `Mesa ${item.restaurantTables.tableNumber}` : '-'}
              </TableCell>
              <TableCell>
                {item.status ? (
                  <Badge variant={STATUS_VARIANTS[item.status as ReservationStatusEnum]}>
                    {STATUS_LABELS[item.status as ReservationStatusEnum]}
                  </Badge>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="max-w-[150px] truncate">{item.notes ?? '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => openEdit(item)}>
                    <Edit2 />
                  </Button>
                  <DialogButton
                    triggerButtonContent={<Trash2 className="text-destructive" />}
                    title="Eliminar reservación"
                    description="¿Estás seguro de que quieres eliminar esta reservación?"
                    type="destructive"
                    onConfirm={() => { if (item.id) remove(item.id) }}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Reservaciones
