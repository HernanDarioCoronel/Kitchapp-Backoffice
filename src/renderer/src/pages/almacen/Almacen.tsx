import { JSX, useMemo, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
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
import {
  useCreateInventoryMovement,
  useCreateStock,
  useDeleteInventoryMovement,
  useDeleteStock,
  useInventoryMovements,
  useStock,
  useUpdateStock
} from './hooks/useAlmacen'
import { useEmployees } from '../masters/hooks/useMasters'
import { useProducts } from '../products/hooks/useProducts'
import { ProductRequestType } from '../products/api/products'
import { InventoryMovement, InventoryMovementTypeEnum, Stock } from '@api/api'

// ─── Stock helpers ────────────────────────────────────────────────────────────

function stockStatusInfo(row: Stock): { label: string; rowClass: string; badgeClass: string } {
  const qty = row.currentQty ?? 0
  const min = row.minStock ?? 0
  if (qty === 0) {
    return {
      label: 'Sin Stock',
      rowClass: 'bg-red-50 dark:bg-red-950/20',
      badgeClass: 'bg-red-100 text-red-700 border-red-300'
    }
  }
  if (qty <= min) {
    return {
      label: 'Bajo',
      rowClass: 'bg-amber-50 dark:bg-amber-950/20',
      badgeClass: 'bg-amber-100 text-amber-700 border-amber-300'
    }
  }
  return {
    label: 'OK',
    rowClass: '',
    badgeClass: 'bg-green-100 text-green-700 border-green-300'
  }
}

const MOVEMENT_TYPE_CONFIG: Record<
  InventoryMovementTypeEnum,
  { label: string; badgeClass: string }
> = {
  [InventoryMovementTypeEnum.Purchase]: {
    label: 'Compra',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  [InventoryMovementTypeEnum.Sale]: {
    label: 'Venta',
    badgeClass: 'bg-green-100 text-green-700 border-green-300'
  },
  [InventoryMovementTypeEnum.Waste]: {
    label: 'Desperdicio',
    badgeClass: 'bg-red-100 text-red-700 border-red-300'
  },
  [InventoryMovementTypeEnum.Adjustment]: {
    label: 'Ajuste',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-300'
  }
}

// ─── Stock section ────────────────────────────────────────────────────────────

interface StockForm {
  productId: string
  currentQty: string
  minStock: string
}

const EMPTY_STOCK_FORM: StockForm = { productId: '', currentQty: '', minStock: '' }

function StockSection(): JSX.Element {
  const { data: stockData } = useStock()
  const { mutate: createStock } = useCreateStock()
  const { mutate: updateStock } = useUpdateStock()
  const { mutate: deleteStock } = useDeleteStock()
  const { data: products } = useProducts(ProductRequestType.ALL)
  const { query } = useSearch()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Stock | null>(null)
  const [form, setForm] = useState<StockForm>(EMPTY_STOCK_FORM)

  const rows = useMemo(() => {
    const base = stockData ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter((s) => (s.product?.name ?? '').toLowerCase().includes(q))
  }, [stockData, query])

  function openCreate(): void {
    setEditing(null)
    setForm(EMPTY_STOCK_FORM)
    setOpen(true)
  }

  function openEdit(item: Stock): void {
    setEditing(item)
    setForm({
      productId: item.product?.id ?? '',
      currentQty: item.currentQty != null ? String(item.currentQty) : '',
      minStock: item.minStock != null ? String(item.minStock) : ''
    })
    setOpen(true)
  }

  function handleSubmit(): void {
    const payload: Stock = {
      product: { id: form.productId },
      currentQty: form.currentQty ? Number(form.currentQty) : undefined,
      minStock: form.minStock ? Number(form.minStock) : undefined
    }
    if (editing?.id) {
      updateStock({ id: editing.id, payload })
    } else {
      createStock(payload)
    }
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Niveles de stock</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar stock' : 'Nuevo registro de stock'}</DialogTitle>
              <DialogDescription>Datos del stock de producto</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Producto</Label>
                <Select
                  value={form.productId}
                  onValueChange={(v) => setForm((s) => ({ ...s, productId: v }))}
                  disabled={!!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {(products ?? [])
                      .filter((p) => p.id)
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id!}>
                          {p.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Cantidad actual</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.currentQty}
                    onChange={(e) => setForm((s) => ({ ...s, currentQty: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Stock mínimo</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.minStock}
                    onChange={(e) => setForm((s) => ({ ...s, minStock: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={!form.productId}>
                {editing ? 'Guardar' : 'Crear'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estado</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad actual</TableHead>
            <TableHead>Stock mínimo</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => {
            const status = stockStatusInfo(item)
            return (
              <TableRow key={item.id} className={`hover:bg-muted/50 ${status.rowClass}`}>
                <TableCell>
                  <Badge variant="outline" className={status.badgeClass}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{item.product?.name ?? '-'}</TableCell>
                <TableCell>
                  {item.currentQty ?? 0} {item.product?.unitType?.abbreviation ?? ''}
                </TableCell>
                <TableCell>
                  {item.minStock ?? 0} {item.product?.unitType?.abbreviation ?? ''}
                </TableCell>
                <TableCell>
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleDateString('es-ES')
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => openEdit(item)}>
                      <Edit2 />
                    </Button>
                    <DialogButton
                      triggerButtonContent={<Trash2 className="text-destructive" />}
                      title="Eliminar stock"
                      description="¿Estás seguro de que quieres eliminar este registro de stock?"
                      type="destructive"
                      onConfirm={() => { if (item.id) deleteStock(item.id) }}
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
    </div>
  )
}

// ─── Movements section ────────────────────────────────────────────────────────

interface MovementForm {
  productId: string
  employeeId: string
  quantity: string
  reason: string
}

const EMPTY_MOVEMENT_FORM: MovementForm = {
  productId: '',
  employeeId: '',
  quantity: '',
  reason: ''
}

function MovementsSection(): JSX.Element {
  const { data: movements } = useInventoryMovements()
  const { mutate: createMovement } = useCreateInventoryMovement()
  const { mutate: deleteMovement } = useDeleteInventoryMovement()
  const { data: products } = useProducts(ProductRequestType.ALL)
  const { data: employees } = useEmployees()
  const { query } = useSearch()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<MovementForm>(EMPTY_MOVEMENT_FORM)

  const rows = useMemo(() => {
    const base = movements ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter((m) => (m.product?.name ?? '').toLowerCase().includes(q))
  }, [movements, query])

  function openCreate(): void {
    setForm(EMPTY_MOVEMENT_FORM)
    setOpen(true)
  }

  function handleSubmit(): void {
    const payload: InventoryMovement = {
      product: { id: form.productId },
      employee: form.employeeId ? { id: form.employeeId } : undefined,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      type: InventoryMovementTypeEnum.Adjustment,
      reason: form.reason || undefined
    }
    createMovement(payload)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Movimientos de inventario</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus /> Nuevo ajuste
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo ajuste de inventario</DialogTitle>
              <DialogDescription>Registrar un ajuste manual de cantidad</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Producto</Label>
                <Select
                  value={form.productId}
                  onValueChange={(v) => setForm((s) => ({ ...s, productId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {(products ?? [])
                      .filter((p) => p.id)
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id!}>
                          {p.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Empleado (opcional)</Label>
                <Select
                  value={form.employeeId}
                  onValueChange={(v) => setForm((s) => ({ ...s, employeeId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {(employees ?? [])
                      .filter((e) => e.id)
                      .map((e) => (
                        <SelectItem key={e.id} value={e.id!}>
                          {e.fullName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.quantity}
                  onChange={(e) => setForm((s) => ({ ...s, quantity: e.target.value }))}
                  placeholder="ej. 10"
                />
              </div>
              <div className="grid gap-1">
                <Label>Motivo</Label>
                <Input
                  value={form.reason}
                  onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
                  placeholder="Motivo del ajuste"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={!form.productId || !form.quantity}>
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Empleado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => {
            const typeKey = item.type as InventoryMovementTypeEnum | undefined
            const typeConfig = typeKey ? MOVEMENT_TYPE_CONFIG[typeKey] : null
            return (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('es-ES')
                    : '-'}
                </TableCell>
                <TableCell className="font-medium">{item.product?.name ?? '-'}</TableCell>
                <TableCell>
                  {typeConfig ? (
                    <Badge variant="outline" className={typeConfig.badgeClass}>
                      {typeConfig.label}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{item.quantity ?? '-'}</TableCell>
                <TableCell>{item.reason ?? '-'}</TableCell>
                <TableCell>{item.employee?.fullName ?? '-'}</TableCell>
                <TableCell>
                  <DialogButton
                    triggerButtonContent={<Trash2 className="text-destructive" />}
                    title="Eliminar movimiento"
                    description="¿Estás seguro de que quieres eliminar este movimiento?"
                    type="destructive"
                    onConfirm={() => { if (item.id) deleteMovement(item.id) }}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function Almacen(): JSX.Element {
  return (
    <div className="h-full flex flex-col gap-4 m-4">
      <h1 className="text-2xl font-bold">Almacén</h1>
      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Niveles de stock</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos de inventario</TabsTrigger>
        </TabsList>
        <TabsContent value="stock">
          <StockSection />
        </TabsContent>
        <TabsContent value="movimientos">
          <MovementsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Almacen
