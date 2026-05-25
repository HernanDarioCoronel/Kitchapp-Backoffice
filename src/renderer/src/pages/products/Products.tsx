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
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import DialogButton from '@renderer/components/DialogButton'
import { ProductRequestType } from './api/products'
import { Product, ProductTypeEnum } from '@api/api'

interface ProductForm {
  sku: string
  name: string
  type: ProductTypeEnum
  caloriesPer100g: string
  isActive: boolean
}

const EMPTY_FORM: ProductForm = {
  sku: '',
  name: '',
  type: ProductTypeEnum.Ingredient,
  caloriesPer100g: '',
  isActive: true
}

function Products(): JSX.Element {
  const [typeFilter, setTypeFilter] = useState<ProductRequestType>(ProductRequestType.ALL)
  const { data, isLoading, isError, error } = useProducts(typeFilter)
  const { mutate: createProduct } = useCreateProduct()
  const { mutate: deleteProduct } = useDeleteProduct()
  const { mutate: updateProduct } = useUpdateProduct()

  const [openForm, setOpenForm] = useState<boolean>(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)

  const { query } = useSearch()

  const rows: Product[] = useMemo(() => {
    const base = data ?? []
    if (!query || query.trim() === '') return base
    const q = query.toLowerCase()
    return base.filter(
      (p) => (p.name ?? '').toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q)
    )
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpenForm(true)
  }

  function openEdit(item: Product): void {
    setEditing(item)
    setForm({
      sku: item.sku ?? '',
      name: item.name ?? '',
      type: (item.type as ProductTypeEnum) ?? ProductTypeEnum.Ingredient,
      caloriesPer100g: item.caloriesPer100g != null ? String(item.caloriesPer100g) : '',
      isActive: item.isActive ?? true
    })
    setOpenForm(true)
  }

  function handleSubmit(): void {
    const payload: Partial<Product> = {
      sku: form.sku || undefined,
      name: form.name || undefined,
      type: form.type,
      caloriesPer100g: form.caloriesPer100g ? Number(form.caloriesPer100g) : undefined,
      isActive: form.isActive
    }
    if (editing?.id) {
      updateProduct({ id: editing.id as unknown as import('crypto').UUID, payload })
    } else {
      createProduct(payload)
    }
    setOpenForm(false)
  }

  if (isLoading) return <div className="flex justify-center items-center">Cargando...</div>
  if (isError)
    return <div className="flex justify-center items-center">Error: {(error as Error).message}</div>

  return (
    <div className="h-full flex flex-col gap-4 m-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos / Ingredientes</h1>
        <div className="flex items-center gap-3">
          <Select
            value={String(typeFilter)}
            onValueChange={(v) => setTypeFilter(Number(v) as ProductRequestType)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={String(ProductRequestType.ALL)}>Todos</SelectItem>
              <SelectItem value={String(ProductRequestType.INGREDIENT)}>Ingredientes</SelectItem>
              <SelectItem value={String(ProductRequestType.PRODUCT)}>Productos</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="flex items-center gap-2">
                <Plus /> Agregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Editar' : 'Agregar'}</DialogTitle>
                <DialogDescription>Complete los datos del producto / ingrediente</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-1">
                  <Label>SKU</Label>
                  <Input
                    value={form.sku}
                    onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))}
                    placeholder="SKU"
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Nombre</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Nombre"
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Tipo</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm((s) => ({ ...s, type: v as ProductTypeEnum }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProductTypeEnum.Ingredient}>Ingrediente</SelectItem>
                      <SelectItem value={ProductTypeEnum.Product}>Producto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label>Kcal cada 100g</Label>
                  <Input
                    type="number"
                    value={form.caloriesPer100g}
                    onChange={(e) => setForm((s) => ({ ...s, caloriesPer100g: e.target.value }))}
                    placeholder="Calorías por 100g"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-input"
                  />
                  <Label htmlFor="isActive">Activo</Label>
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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Kcal cada 100g</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item: Product) => (
            <TableRow key={item.id ?? ''} className="border-b hover:bg-muted/50">
              <TableCell>{item.sku ?? '-'}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type ?? '-'}</TableCell>
              <TableCell>{item.caloriesPer100g ?? '-'}</TableCell>
              <TableCell>{item.category?.name ?? '-'}</TableCell>
              <TableCell>{item.isActive ? 'Sí' : 'No'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={(): void => openEdit(item)}>
                    <Edit2 />
                  </Button>
                  <DialogButton
                    triggerButtonContent={<Trash2 className="text-destructive" />}
                    title="Eliminar"
                    description="¿Estás seguro de que quieres eliminar este elemento?"
                    type="destructive"
                    onConfirm={(): void => {
                      if (item.id) {
                        deleteProduct(item.id as unknown as import('crypto').UUID)
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
