import { JSX, useMemo, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@renderer/components/ui/tabs'
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
  useAllergens,
  useCategoriesMasters,
  useCreateAllergen,
  useCreateCategory,
  useCreateTax,
  useCreateUnitType,
  useDeleteAllergen,
  useDeleteCategory,
  useDeleteTax,
  useDeleteUnitType,
  useTaxes,
  useUnitTypesMasters,
  useUpdateAllergen,
  useUpdateCategory,
  useUpdateTax,
  useUpdateUnitType
} from './hooks/useMasters'
import { Allergen, Category, CategoryTypeEnum, Tax, UnitType } from '@api/api'

// ─── Allergens ───────────────────────────────────────────────────────────────

interface AllergenForm {
  name: string
  description: string
}

const EMPTY_ALLERGEN: AllergenForm = { name: '', description: '' }

function AllergenSection(): JSX.Element {
  const { data } = useAllergens()
  const { mutate: create } = useCreateAllergen()
  const { mutate: update } = useUpdateAllergen()
  const { mutate: remove } = useDeleteAllergen()
  const { query } = useSearch()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Allergen | null>(null)
  const [form, setForm] = useState<AllergenForm>(EMPTY_ALLERGEN)

  const rows = useMemo(() => {
    const base = data ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter((a) => (a.name ?? '').toLowerCase().includes(q))
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setForm(EMPTY_ALLERGEN)
    setOpen(true)
  }

  function openEdit(item: Allergen): void {
    setEditing(item)
    setForm({ name: item.name ?? '', description: item.description ?? '' })
    setOpen(true)
  }

  function handleSubmit(): void {
    const payload: Allergen = { name: form.name, description: form.description }
    if (editing?.id) {
      update({ id: editing.id, payload })
    } else {
      create(payload)
    }
    setOpen(false)
  }

  return (
    <Section
      title="Allergens"
      onAdd={openCreate}
      dialog={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar alérgeno' : 'Nuevo alérgeno'}</DialogTitle>
              <DialogDescription>Datos del alérgeno</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Name"
                />
              </div>
              <div className="grid gap-1">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Description"
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
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description ?? '-'}</TableCell>
              <TableCell>
                <RowActions
                  onEdit={() => openEdit(item)}
                  onDelete={() => item.id && remove(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  )
}

// ─── Categories ──────────────────────────────────────────────────────────────

interface CategoryForm {
  name: string
  description: string
  color: string
  type: CategoryTypeEnum
  active: boolean
}

const EMPTY_CATEGORY: CategoryForm = {
  name: '',
  description: '',
  color: '',
  type: CategoryTypeEnum.Product,
  active: true
}

const CATEGORY_TYPE_LABELS: Record<CategoryTypeEnum, string> = {
  [CategoryTypeEnum.Dish]: 'Plato',
  [CategoryTypeEnum.Product]: 'Producto',
  [CategoryTypeEnum.Ingredient]: 'Ingrediente'
}

function CategorySection(): JSX.Element {
  const { data } = useCategoriesMasters()
  const { mutate: create } = useCreateCategory()
  const { mutate: update } = useUpdateCategory()
  const { mutate: remove } = useDeleteCategory()
  const { query } = useSearch()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryForm>(EMPTY_CATEGORY)

  const rows = useMemo(() => {
    const base = data ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter((c) => (c.name ?? '').toLowerCase().includes(q))
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setForm(EMPTY_CATEGORY)
    setOpen(true)
  }

  function openEdit(item: Category): void {
    setEditing(item)
    setForm({
      name: item.name ?? '',
      description: item.description ?? '',
      color: item.color ?? '',
      type: (item.type as CategoryTypeEnum) ?? CategoryTypeEnum.Product,
      active: item.active ?? true
    })
    setOpen(true)
  }

  function handleSubmit(): void {
    const payload: Category = {
      name: form.name,
      description: form.description,
      color: form.color || undefined,
      type: form.type,
      active: form.active
    }
    if (editing?.id) {
      update({ id: editing.id, payload })
    } else {
      create(payload)
    }
    setOpen(false)
  }

  return (
    <Section
      title="Categories"
      onAdd={openCreate}
      dialog={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
              <DialogDescription>Datos de la categoría</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Name"
                />
              </div>
              <div className="grid gap-1">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Description"
                />
              </div>
              <div className="grid gap-1">
                <Label>Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((s) => ({ ...s, type: v as CategoryTypeEnum }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CategoryTypeEnum).map((t) => (
                      <SelectItem key={t} value={t}>
                        {CATEGORY_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Color</Label>
                <Input
                  value={form.color}
                  onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))}
                  placeholder="ej. #FF5733"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="cat-active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((s) => ({ ...s, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="cat-active">Activa</Label>
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
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Activa</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.color && (
                    <span
                      className="inline-block h-3 w-3 rounded-full border"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  {item.name}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {item.type ? CATEGORY_TYPE_LABELS[item.type as CategoryTypeEnum] : '-'}
                </Badge>
              </TableCell>
              <TableCell>{item.active ? 'Sí' : 'No'}</TableCell>
              <TableCell>{item.description ?? '-'}</TableCell>
              <TableCell>
                <RowActions
                  onEdit={() => openEdit(item)}
                  onDelete={() => item.id && remove(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  )
}

// ─── Taxes ────────────────────────────────────────────────────────────────────

interface TaxForm {
  name: string
  value: string
}

const EMPTY_TAX: TaxForm = { name: '', value: '' }

function TaxSection(): JSX.Element {
  const { data } = useTaxes()
  const { mutate: create } = useCreateTax()
  const { mutate: update } = useUpdateTax()
  const { mutate: remove } = useDeleteTax()
  const { query } = useSearch()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Tax | null>(null)
  const [form, setForm] = useState<TaxForm>(EMPTY_TAX)

  const rows = useMemo(() => {
    const base = data ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter((t) => (t.name ?? '').toLowerCase().includes(q))
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setForm(EMPTY_TAX)
    setOpen(true)
  }

  function openEdit(item: Tax): void {
    setEditing(item)
    setForm({ name: item.name ?? '', value: item.value != null ? String(item.value) : '' })
    setOpen(true)
  }

  function handleSubmit(): void {
    const payload: Tax = {
      name: form.name,
      value: form.value ? Number(form.value) : undefined
    }
    if (editing?.id) {
      update({ id: editing.id, payload })
    } else {
      create(payload)
    }
    setOpen(false)
  }

  return (
    <Section
      title="Taxes"
      onAdd={openCreate}
      dialog={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar impuesto' : 'Nuevo impuesto'}</DialogTitle>
              <DialogDescription>Datos del impuesto</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Name"
                />
              </div>
              <div className="grid gap-1">
                <Label>Valor (%)</Label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm((s) => ({ ...s, value: e.target.value }))}
                  placeholder="ej. 21"
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
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Valor (%)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.value != null ? `${item.value}%` : '-'}</TableCell>
              <TableCell>
                <RowActions
                  onEdit={() => openEdit(item)}
                  onDelete={() => item.id && remove(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  )
}

// ─── Unit Types ───────────────────────────────────────────────────────────────

interface UnitTypeForm {
  name: string
  abbreviation: string
}

const EMPTY_UNIT_TYPE: UnitTypeForm = { name: '', abbreviation: '' }

function UnitTypeSection(): JSX.Element {
  const { data } = useUnitTypesMasters()
  const { mutate: create } = useCreateUnitType()
  const { mutate: update } = useUpdateUnitType()
  const { mutate: remove } = useDeleteUnitType()
  const { query } = useSearch()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<UnitType | null>(null)
  const [form, setForm] = useState<UnitTypeForm>(EMPTY_UNIT_TYPE)

  const rows = useMemo(() => {
    const base = data ?? []
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter(
      (u) =>
        (u.name ?? '').toLowerCase().includes(q) ||
        (u.abbreviation ?? '').toLowerCase().includes(q)
    )
  }, [data, query])

  function openCreate(): void {
    setEditing(null)
    setForm(EMPTY_UNIT_TYPE)
    setOpen(true)
  }

  function openEdit(item: UnitType): void {
    setEditing(item)
    setForm({ name: item.name ?? '', abbreviation: item.abbreviation ?? '' })
    setOpen(true)
  }

  function handleSubmit(): void {
    const payload: UnitType = { name: form.name, abbreviation: form.abbreviation }
    if (editing?.id) {
      update({ id: editing.id, payload })
    } else {
      create(payload)
    }
    setOpen(false)
  }

  return (
    <Section
      title="Units de medida"
      onAdd={openCreate}
      dialog={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar unidad' : 'Nueva unidad de medida'}</DialogTitle>
              <DialogDescription>Datos de la unidad</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Name"
                />
              </div>
              <div className="grid gap-1">
                <Label>Abreviatura</Label>
                <Input
                  value={form.abbreviation}
                  onChange={(e) => setForm((s) => ({ ...s, abbreviation: e.target.value }))}
                  placeholder="ej. kg"
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
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Abreviatura</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.abbreviation ?? '-'}</TableCell>
              <TableCell>
                <RowActions
                  onEdit={() => openEdit(item)}
                  onDelete={() => item.id && remove(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  )
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Section({
  title,
  dialog,
  children
}: {
  title: string
  onAdd: () => void
  dialog: JSX.Element
  children: JSX.Element
}): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {dialog}
      </div>
      {children}
    </div>
  )
}

function RowActions({
  onEdit,
  onDelete
}: {
  onEdit: () => void
  onDelete: () => void
}): JSX.Element {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" onClick={onEdit}>
        <Edit2 />
      </Button>
      <DialogButton
        triggerButtonContent={<Trash2 className="text-destructive" />}
        title="Eliminar"
        description="¿Estás seguro de que quieres eliminar este elemento?"
        type="destructive"
        onConfirm={onDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function Masters(): JSX.Element {
  return (
    <div className="h-full flex flex-col gap-4 m-4">
      <h1 className="text-2xl font-bold">Masters</h1>
      <Tabs defaultValue="allergens">
        <TabsList>
          <TabsTrigger value="allergens">Allergens</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="unit-types">Units</TabsTrigger>
        </TabsList>
        <TabsContent value="allergens">
          <AllergenSection />
        </TabsContent>
        <TabsContent value="categories">
          <CategorySection />
        </TabsContent>
        <TabsContent value="taxes">
          <TaxSection />
        </TabsContent>
        <TabsContent value="unit-types">
          <UnitTypeSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Masters
