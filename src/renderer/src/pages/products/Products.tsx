import { JSX, useMemo, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead
} from '@renderer/components/ui/table'
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct
} from './hooks/useProducts'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import DialogButton from '@renderer/components/DialogButton'
import { ProductRequestType } from './api/products'
import { Product } from '@api/api'

function Products(): JSX.Element {
  const { data, isLoading, isError, error } = useProducts(ProductRequestType.INGREDIENT)
  const { mutate: createIngredient } = useCreateProduct()
  const { mutate: deleteIngredient } = useDeleteProduct()
  const { mutate: updateIngredient } = useUpdateProduct()

  const [openForm, setOpenForm] = useState<boolean>(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<{ name: string; quantity: string; unit: string }>({
    name: '',
    quantity: '',
    unit: ''
  })

  const { query } = useSearch()

  const rows: Product[] = useMemo(() => {
    const base = data ?? []
    if (!query || query.trim() === '') return base
    const q = query.toLowerCase()
    return base.filter((p) => (p.name ?? '').toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q))
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setForm({ name: '', quantity: '', unit: '' })
    setOpenForm(true)
  }

  function openEdit(item: Product): void {
    setEditing(item)
    setOpenForm(true)
  }

  function handleSubmit(): void {
    const payload = {
      name: form.name,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      unit: form.unit
    }
    if (editing?.id) {
      updateIngredient({ id: editing.id as unknown as import('crypto').UUID, payload })
    } else {
      createIngredient(payload)
    }
    setOpenForm(false)
  }

  if (isLoading) return <div className="flex justify-center items-center">Cargando...</div>
  if (isError)
    return <div className="flex justify-center items-center">Error: {(error as Error).message}</div>

  return (
    <div className="h-full flex flex-col gap-4 m-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ingredientes</h1>
        <div>
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="flex items-center gap-2">
                <Plus /> Agregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Editar Ingrediente' : 'Agregar Ingrediente'}</DialogTitle>
                <DialogDescription>Complete los datos del ingrediente</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-2">
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Nombre"
                />
                <Input
                  value={form.quantity}
                  onChange={(e) => setForm((s) => ({ ...s, quantity: e.target.value }))}
                  placeholder="Cantidad"
                />
                <Input
                  value={form.unit}
                  onChange={(e) => setForm((s) => ({ ...s, unit: e.target.value }))}
                  placeholder="Unidad"
                />
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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Kcal cada 100grs</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((ing: Product) => (
            <TableRow key={ing.id ?? ''} className="border-b hover:bg-muted/50">
              <TableCell>{ing.sku}</TableCell>
              <TableCell>{ing.name}</TableCell>
              <TableCell>{ing.caloriesPer100g ?? '-'}</TableCell>
              <TableCell>{ing.category?.name ?? '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={(): void => openEdit(ing)}>
                    <Edit2 />
                  </Button>
                  <DialogButton
                    triggerButtonContent={<Trash2 className="text-destructive" />}
                    title="Eliminar Ingrediente"
                    description="¿Estás seguro de que quieres eliminar este ingrediente?"
                    type="destructive"
                    onConfirm={(): void => {
                      if (ing.id) {
                        deleteIngredient(ing.id as unknown as import('crypto').UUID)
                      }
                    }}
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

export default Products
