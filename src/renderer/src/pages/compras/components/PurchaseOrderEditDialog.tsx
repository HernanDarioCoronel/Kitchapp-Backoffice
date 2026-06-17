import { JSX, useState } from 'react'
import { useCreatePurchaseOrder, useUpdatePurchaseOrder } from '../hooks/useCompras'
import { useSuppliers } from '../../proveedores/hooks/useProveedores'
import { useProducts } from '../../products/hooks/useProducts'
import { ProductRequestType } from '../../products/api/products'
import { useTaxes } from '../../masters/hooks/useMasters'
import { PurchaseOrder, PurchaseOrderStatusEnum } from '@api/api'
import { X, Plus } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderForm {
  supplierId: string
  orderNumber: string
  status: PurchaseOrderStatusEnum
  dueDate: string
  notes: string
}

interface LineEntry {
  id?: string
  productId: string
  productName: string
  description: string
  quantity: string
  unitPrice: string
  taxId: string
  taxName: string
  lineSubtotal?: number
}

const EMPTY_FORM: OrderForm = {
  supplierId: '',
  orderNumber: '',
  status: PurchaseOrderStatusEnum.Draft,
  dueDate: '',
  notes: ''
}

const EMPTY_LINE: LineEntry = {
  productId: '',
  productName: '',
  description: '',
  quantity: '',
  unitPrice: '',
  taxId: '',
  taxName: ''
}

const STATUS_LABELS: Record<PurchaseOrderStatusEnum, string> = {
  [PurchaseOrderStatusEnum.Draft]: 'Borrador',
  [PurchaseOrderStatusEnum.Sent]: 'Enviado',
  [PurchaseOrderStatusEnum.Received]: 'Recibido',
  [PurchaseOrderStatusEnum.Verified]: 'Verificado',
  [PurchaseOrderStatusEnum.Cancelled]: 'Cancelado'
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PurchaseOrderEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: PurchaseOrder | null
}

// ─── Component ────────────────────────────────────────────────────────────────

function PurchaseOrderEditDialog({
  open,
  onOpenChange,
  editing
}: PurchaseOrderEditDialogProps): JSX.Element {
  const { mutate: createOrder, isLoading: isCreating } = useCreatePurchaseOrder()
  const { mutate: updateOrder, isLoading: isUpdating } = useUpdatePurchaseOrder()
  const { data: suppliers } = useSuppliers()
  const { data: products } = useProducts(ProductRequestType.ALL)
  const { data: taxes } = useTaxes()

  const [form, setForm] = useState<OrderForm>(() =>
    editing
      ? {
          supplierId: editing.supplier?.id ?? '',
          orderNumber: editing.orderNumber ?? '',
          status: (editing.status as PurchaseOrderStatusEnum) ?? PurchaseOrderStatusEnum.Draft,
          dueDate: editing.dueDate ?? '',
          notes: editing.notes ?? ''
        }
      : EMPTY_FORM
  )

  const [lines, setLines] = useState<LineEntry[]>(() =>
    (editing?.purchaseOrderLines ?? []).map((l) => ({
      id: l.id,
      productId: l.product?.id ?? '',
      productName: l.product?.name ?? '',
      description: l.description ?? '',
      quantity: l.quantity != null ? String(l.quantity) : '',
      unitPrice: l.unitPrice != null ? String(l.unitPrice) : '',
      taxId: l.tax?.id ?? '',
      taxName: l.tax?.name ?? '',
      lineSubtotal: l.lineSubtotal
    }))
  )

  const [newLine, setNewLine] = useState<LineEntry>(EMPTY_LINE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function addLine(): void {
    if (!newLine.productId) return
    setLines((prev) => [...prev, { ...newLine }])
    setNewLine(EMPTY_LINE)
  }

  function removeLine(idx: number): void {
    setLines((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleProductSelect(productId: string): void {
    const product = (products ?? []).find((p) => p.id === productId)
    setNewLine((s) => ({ ...s, productId, productName: product?.name ?? '' }))
  }

  function handleTaxSelect(taxId: string): void {
    const tax = (taxes ?? []).find((t) => t.id === taxId)
    setNewLine((s) => ({ ...s, taxId, taxName: tax?.name ?? '' }))
  }

  function estimatedSubtotal(line: LineEntry): string {
    const qty = line.quantity ? Number(line.quantity) : 0
    const price = line.unitPrice ? Number(line.unitPrice) : 0
    return (qty * price).toFixed(2)
  }

  async function handleSubmit(): Promise<void> {
    setIsSubmitting(true)
    try {
      const payload: PurchaseOrder = {
        supplier: form.supplierId ? { id: form.supplierId } : undefined,
        orderNumber: form.orderNumber || undefined,
        status: form.status,
        dueDate: form.dueDate || undefined,
        notes: form.notes || undefined,
        purchaseOrderLines: lines.map((l) => ({
          id: l.id,
          product: { id: l.productId },
          description: l.description || undefined,
          quantity: l.quantity ? Number(l.quantity) : undefined,
          unitPrice: l.unitPrice ? Number(l.unitPrice) : undefined,
          tax: l.taxId ? { id: l.taxId } : undefined
        }))
      }
      if (editing?.id) {
        updateOrder({ id: editing.id, payload })
      } else {
        createOrder(payload)
      }
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl! flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar orden de compra' : 'Nueva orden de compra'}</DialogTitle>
          <DialogDescription>Complete los datos de la orden</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 overflow-y-auto pr-1">
          {/* Cabecera del pedido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Proveedor</Label>
              <Select
                value={form.supplierId}
                onValueChange={(v) => setForm((s) => ({ ...s, supplierId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {(suppliers ?? [])
                    .filter((s) => s.id)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id!}>
                        {s.tradeName ?? s.businessName ?? s.id}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Nº pedido</Label>
              <Input
                value={form.orderNumber}
                onChange={(e) => setForm((s) => ({ ...s, orderNumber: e.target.value }))}
                placeholder="PO-2026-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((s) => ({ ...s, status: v as PurchaseOrderStatusEnum }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PurchaseOrderStatusEnum).map((st) => (
                    <SelectItem key={st} value={st}>
                      {STATUS_LABELS[st]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Fecha de vencimiento</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-1">
            <Label>Notas</Label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              placeholder="Notas adicionales..."
              className="min-h-[60px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Líneas del pedido */}
          <div className="grid gap-2">
            <Label>Líneas del pedido</Label>

            {lines.length > 0 && (
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Producto</th>
                      <th className="px-3 py-2 text-left font-medium">Descripción</th>
                      <th className="px-3 py-2 text-left font-medium w-20">Cant.</th>
                      <th className="px-3 py-2 text-left font-medium w-24">P. Unit.</th>
                      <th className="px-3 py-2 text-left font-medium w-20">IVA</th>
                      <th className="px-3 py-2 text-right font-medium w-24">Subtotal</th>
                      <th className="px-3 py-2 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-3 py-2">{line.productName || '—'}</td>
                        <td className="px-3 py-2">{line.description || '—'}</td>
                        <td className="px-3 py-2">{line.quantity || '—'}</td>
                        <td className="px-3 py-2">
                          {line.unitPrice ? `${Number(line.unitPrice).toFixed(2)} €` : '—'}
                        </td>
                        <td className="px-3 py-2">{line.taxName || '—'}</td>
                        <td className="px-3 py-2 text-right">
                          {line.lineSubtotal != null
                            ? `${line.lineSubtotal.toFixed(2)} €`
                            : `~${estimatedSubtotal(line)} €`}
                        </td>
                        <td className="px-3 py-2">
                          <button type="button" onClick={() => removeLine(idx)}>
                            <X className="w-4 h-4 text-destructive" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Fila para añadir nueva línea */}
            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <Select value={newLine.productId} onValueChange={handleProductSelect}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Producto" />
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
              <Input
                className="flex-1 min-w-[100px] h-9"
                value={newLine.description}
                onChange={(e) => setNewLine((s) => ({ ...s, description: e.target.value }))}
                placeholder="Descripción"
              />
              <Input
                type="number"
                step="0.01"
                className="w-20 h-9"
                value={newLine.quantity}
                onChange={(e) => setNewLine((s) => ({ ...s, quantity: e.target.value }))}
                placeholder="Cant."
              />
              <Input
                type="number"
                step="0.01"
                className="w-24 h-9"
                value={newLine.unitPrice}
                onChange={(e) => setNewLine((s) => ({ ...s, unitPrice: e.target.value }))}
                placeholder="P. Unit."
              />
              <div className="w-28">
                <Select value={newLine.taxId} onValueChange={handleTaxSelect}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="IVA" />
                  </SelectTrigger>
                  <SelectContent>
                    {(taxes ?? [])
                      .filter((t) => t.id)
                      .map((t) => (
                        <SelectItem key={t.id} value={t.id!}>
                          {t.name} ({t.value}%)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" size="sm" onClick={addLine} className="h-9">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Totales (solo al editar una orden ya guardada) */}
          {editing && (
            <div className="rounded-lg border p-3 bg-muted/30">
              <p className="text-sm font-medium mb-2">Resumen (calculado por servidor)</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Base imponible</span>
                  <p className="font-medium">
                    {editing.netAmount != null ? `${editing.netAmount.toFixed(2)} €` : '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">IVA</span>
                  <p className="font-medium">
                    {editing.taxAmount != null ? `${editing.taxAmount.toFixed(2)} €` : '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total</span>
                  <p className="text-lg font-bold">
                    {editing.total != null ? `${editing.total.toFixed(2)} €` : '—'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || isCreating || isUpdating}
          >
            {isSubmitting ? 'Guardando...' : editing ? 'Guardar' : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseOrderEditDialog
