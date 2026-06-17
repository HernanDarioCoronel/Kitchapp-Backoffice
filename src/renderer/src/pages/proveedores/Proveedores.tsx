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
import {
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier
} from './hooks/useProveedores'
import { Supplier, SupplierDaysEnum, SupplierTypeEnum } from '@api/api'

// ─── Label maps ───────────────────────────────────────────────────────────────

const SUPPLIER_TYPE_LABELS: Record<SupplierTypeEnum, string> = {
  [SupplierTypeEnum.Perishables]: 'Perecederos',
  [SupplierTypeEnum.Drinks]: 'Bebidas',
  [SupplierTypeEnum.Kitchenware]: 'Menaje',
  [SupplierTypeEnum.Appliances]: 'Electrodomésticos',
  [SupplierTypeEnum.Services]: 'Servicios'
}

const SUPPLIER_DAYS_LABELS: Record<SupplierDaysEnum, string> = {
  [SupplierDaysEnum.Mon]: 'Lunes',
  [SupplierDaysEnum.Tue]: 'Martes',
  [SupplierDaysEnum.Wed]: 'Miércoles',
  [SupplierDaysEnum.Thu]: 'Jueves',
  [SupplierDaysEnum.Fri]: 'Viernes',
  [SupplierDaysEnum.Ord]: 'A pedido',
  [SupplierDaysEnum.Var]: 'Variable'
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface SupplierForm {
  nif: string
  tradeName: string
  businessName: string
  reEquivalence: boolean
  type: SupplierTypeEnum
  days: SupplierDaysEnum
  email: string
  phone1: string
  phone2: string
  iban: string
  rgseaaNumber: string
}

const EMPTY_FORM: SupplierForm = {
  nif: '',
  tradeName: '',
  businessName: '',
  reEquivalence: false,
  type: SupplierTypeEnum.Perishables,
  days: SupplierDaysEnum.Var,
  email: '',
  phone1: '',
  phone2: '',
  iban: '',
  rgseaaNumber: ''
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function Proveedores(): JSX.Element {
  const { data } = useSuppliers()
  const { mutate: create } = useCreateSupplier()
  const { mutate: update } = useUpdateSupplier()
  const { mutate: remove } = useDeleteSupplier()
  const { query } = useSearch()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState<SupplierForm>(EMPTY_FORM)

  const rows = useMemo(() => {
    const base = data ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter(
      (s) =>
        (s.tradeName ?? '').toLowerCase().includes(q) ||
        (s.businessName ?? '').toLowerCase().includes(q) ||
        (s.nif ?? '').toLowerCase().includes(q)
    )
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function openEdit(item: Supplier): void {
    setEditing(item)
    setForm({
      nif: item.nif ?? '',
      tradeName: item.tradeName ?? '',
      businessName: item.businessName ?? '',
      reEquivalence: item.reEquivalence ?? false,
      type: (item.type as SupplierTypeEnum) ?? SupplierTypeEnum.Perishables,
      days: (item.days as SupplierDaysEnum) ?? SupplierDaysEnum.Var,
      email: item.email ?? '',
      phone1: item.phone1 ?? '',
      phone2: item.phone2 ?? '',
      iban: item.iban ?? '',
      rgseaaNumber: item.rgseaaNumber ?? ''
    })
    setOpen(true)
  }

  function handleSubmit(): void {
    const payload: Supplier = {
      nif: form.nif || undefined,
      tradeName: form.tradeName || undefined,
      businessName: form.businessName || undefined,
      reEquivalence: form.reEquivalence,
      type: form.type,
      days: form.days,
      email: form.email || undefined,
      phone1: form.phone1 || undefined,
      phone2: form.phone2 || undefined,
      iban: form.iban || undefined,
      rgseaaNumber: form.rgseaaNumber || undefined
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
        <h1 className="text-2xl font-bold">Proveedores</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl!">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar proveedor' : 'Nuevo proveedor'}</DialogTitle>
              <DialogDescription>Datos del proveedor</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>NIF</Label>
                  <Input
                    value={form.nif}
                    onChange={(e) => setForm((s) => ({ ...s, nif: e.target.value }))}
                    placeholder="B12345678"
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Nombre comercial</Label>
                  <Input
                    value={form.tradeName}
                    onChange={(e) => setForm((s) => ({ ...s, tradeName: e.target.value }))}
                    placeholder="Nombre comercial"
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Razón social</Label>
                <Input
                  value={form.businessName}
                  onChange={(e) => setForm((s) => ({ ...s, businessName: e.target.value }))}
                  placeholder="Razón social"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Tipo</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm((s) => ({ ...s, type: v as SupplierTypeEnum }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SupplierTypeEnum).map((t) => (
                        <SelectItem key={t} value={t}>
                          {SUPPLIER_TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label>Día de entrega</Label>
                  <Select
                    value={form.days}
                    onValueChange={(v) => setForm((s) => ({ ...s, days: v as SupplierDaysEnum }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SupplierDaysEnum).map((d) => (
                        <SelectItem key={d} value={d}>
                          {SUPPLIER_DAYS_LABELS[d]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  placeholder="contacto@proveedor.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Teléfono 1</Label>
                  <Input
                    value={form.phone1}
                    onChange={(e) => setForm((s) => ({ ...s, phone1: e.target.value }))}
                    placeholder="+34 600 000 000"
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Teléfono 2</Label>
                  <Input
                    value={form.phone2}
                    onChange={(e) => setForm((s) => ({ ...s, phone2: e.target.value }))}
                    placeholder="+34 600 000 001"
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>IBAN</Label>
                <Input
                  value={form.iban}
                  onChange={(e) => setForm((s) => ({ ...s, iban: e.target.value }))}
                  placeholder="ES00 0000 0000 0000 0000 0000"
                />
              </div>
              <div className="grid gap-1">
                <Label>Nº RGSEAA</Label>
                <Input
                  value={form.rgseaaNumber}
                  onChange={(e) => setForm((s) => ({ ...s, rgseaaNumber: e.target.value }))}
                  placeholder="Número RGSEAA"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="reEquivalence"
                  type="checkbox"
                  checked={form.reEquivalence}
                  onChange={(e) => setForm((s) => ({ ...s, reEquivalence: e.target.checked }))}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="reEquivalence">Recargo de equivalencia</Label>
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
            <TableHead>NIF</TableHead>
            <TableHead>Nombre comercial</TableHead>
            <TableHead>Razón social</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Día entrega</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>R. Equiv.</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell>{item.nif ?? '-'}</TableCell>
              <TableCell className="font-medium">{item.tradeName ?? '-'}</TableCell>
              <TableCell>{item.businessName ?? '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {item.type ? SUPPLIER_TYPE_LABELS[item.type as SupplierTypeEnum] : '-'}
                </Badge>
              </TableCell>
              <TableCell>
                {item.days ? SUPPLIER_DAYS_LABELS[item.days as SupplierDaysEnum] : '-'}
              </TableCell>
              <TableCell>{item.email ?? '-'}</TableCell>
              <TableCell>{item.phone1 ?? '-'}</TableCell>
              <TableCell>{item.reEquivalence ? 'Sí' : 'No'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => openEdit(item)}>
                    <Edit2 />
                  </Button>
                  <DialogButton
                    triggerButtonContent={<Trash2 className="text-destructive" />}
                    title="Eliminar proveedor"
                    description="¿Estás seguro de que quieres eliminar este proveedor?"
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

export default Proveedores
