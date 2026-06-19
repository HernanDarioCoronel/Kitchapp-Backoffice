import { JSX, useState } from 'react'
import { useCreateDish, useUpdateDish } from '../hooks/useDishes'
import { useCategories, useProducts } from '../../products/hooks/useProducts'
import { ProductRequestType } from '../../products/api/products'
import { uploadImage } from '@renderer/lib/images'
import { CategoryTypeEnum, Dish } from '@api/api'
import { UUID } from 'crypto'
import placeholderImg from '@resources/placeholder.jpg'
import { Upload, Plus, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Button } from '@renderer/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return placeholderImg
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${API_BASE}/images/${imageUrl}`
}

interface DishForm {
  name: string
  description: string
  prepTime: string
  price: string
  categoryId: string
  isAvailable: boolean
}

interface IngredientEntry {
  id?: string
  productId: string
  productName: string
  unitAbbr: string
  quantity: string
  optional: boolean
}

const EMPTY_FORM: DishForm = {
  name: '',
  description: '',
  prepTime: '',
  price: '',
  categoryId: '',
  isAvailable: true
}

interface DishEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Dish | null
}

function DishEditDialog({ open, onOpenChange, editing }: DishEditDialogProps): JSX.Element {
  const { mutate: createDish, isPending: isCreating } = useCreateDish()
  const { mutate: updateDish, isPending: isUpdating } = useUpdateDish()
  const { data: productsData } = useProducts(ProductRequestType.ALL)
  const { data: categories } = useCategories()

  const [form, setForm] = useState<DishForm>(() =>
    editing
      ? {
          name: editing.name ?? '',
          description: editing.description ?? '',
          prepTime: editing.prepTime != null ? String(editing.prepTime) : '',
          price: editing.price != null ? String(editing.price) : '',
          categoryId: editing.dishCategory?.id ?? '',
          isAvailable: editing.isAvailable ?? true
        }
      : EMPTY_FORM
  )
  const [ingredients, setIngredients] = useState<IngredientEntry[]>(() =>
    (editing?.dishIngredientList ?? []).map((ing) => ({
      id: ing.id,
      productId: ing.product?.id ?? '',
      productName: ing.product?.name ?? '',
      unitAbbr: ing.product?.unitType?.abbreviation ?? '',
      quantity: ing.quantity != null ? String(ing.quantity) : '1',
      optional: ing.optional ?? false
    }))
  )
  const [newIngredient, setNewIngredient] = useState({
    productId: '',
    quantity: '1',
    optional: false
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(() =>
    editing?.imageUrl ? getImageUrl(editing.imageUrl) : ''
  )
  const existingImageUrl = editing?.imageUrl ?? ''
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function addIngredient(): void {
    if (!newIngredient.productId) return
    const product = (productsData ?? []).find((p) => p.id === newIngredient.productId)
    setIngredients((prev) => [
      ...prev,
      {
        productId: newIngredient.productId,
        productName: product?.name ?? '',
        unitAbbr: product?.unitType?.abbreviation ?? '',
        quantity: newIngredient.quantity || '1',
        optional: newIngredient.optional
      }
    ])
    setNewIngredient({ productId: '', quantity: '1', optional: false })
  }

  function removeIngredient(idx: number): void {
    setIngredients((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(): Promise<void> {
    setIsSubmitting(true)
    try {
      let imageUrl: string | undefined = existingImageUrl || undefined
      if (imageFile) {
        const res = await uploadImage(imageFile)
        imageUrl = res.url
      }

      const payload = {
        name: form.name || undefined,
        description: form.description || undefined,
        prepTime: form.prepTime ? Number(form.prepTime) : undefined,
        price: form.price ? Number(form.price) : undefined,
        dishCategory: form.categoryId ? { id: form.categoryId } : undefined,
        isAvailable: form.isAvailable,
        imageUrl,
        dishIngredientList: ingredients.map((ing) => ({
          id: ing.id,
          product: { id: ing.productId },
          quantity: ing.quantity ? Number(ing.quantity) : undefined,
          optional: ing.optional
        }))
      }

      if (editing?.id) {
        updateDish({ id: editing.id as UUID, payload })
      } else {
        createDish(payload)
      }
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl! flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar platillo' : 'Nuevo platillo'}</DialogTitle>
          <DialogDescription>Complete los datos del platillo</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2 overflow-y-auto pr-1">
          <div className="grid gap-1">
            <Label>Nombre</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Nombre del platillo"
            />
          </div>
          <div className="grid gap-1">
            <Label>Descripción</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Descripción"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Tiempo de preparación (min)</Label>
              <Input
                type="number"
                value={form.prepTime}
                onChange={(e) => setForm((s) => ({ ...s, prepTime: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="grid gap-1">
              <Label>Precio ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid gap-1">
            <Label>Categoría</Label>
            <Select
              value={form.categoryId}
              onValueChange={(v) => setForm((s) => ({ ...s, categoryId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {(categories ?? [])
                  .filter((c) => c.id && c.type === CategoryTypeEnum.Dish)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id!}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <Label>Imagen</Label>
            <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="absolute inset-0 h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Seleccionar imagen</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {imagePreview && existingImageUrl && (
              <button
                type="button"
                className="text-xs text-muted-foreground underline self-start"
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(getImageUrl(existingImageUrl))
                }}
              >
                Restablecer imagen
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm((s) => ({ ...s, isAvailable: e.target.checked }))}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isAvailable">Disponible</Label>
          </div>

          <div className="grid gap-2">
            <Label>Ingredientes</Label>

            {ingredients.length > 0 && (
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Ingrediente</th>
                      <th className="px-3 py-2 text-left font-medium">Cantidad</th>
                      <th className="px-3 py-2 text-left font-medium">Opcional</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-3 py-2">{ing.productName || '—'}</td>
                        <td className="px-3 py-2">
                          {ing.quantity} {ing.unitAbbr}
                        </td>
                        <td className="px-3 py-2">{ing.optional ? 'Sí' : 'No'}</td>
                        <td className="px-3 py-2">
                          <button type="button" onClick={() => removeIngredient(idx)}>
                            <X className="w-4 h-4 text-destructive" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Select
                  value={newIngredient.productId}
                  onValueChange={(v) => setNewIngredient((s) => ({ ...s, productId: v }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {(productsData ?? [])
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
                type="number"
                className="w-20 h-9"
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient((s) => ({ ...s, quantity: e.target.value }))}
                placeholder="Cant."
              />
              <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={newIngredient.optional}
                  onChange={(e) => setNewIngredient((s) => ({ ...s, optional: e.target.checked }))}
                  className="h-4 w-4"
                />
                Opcional
              </label>
              <Button type="button" size="sm" onClick={addIngredient} className="h-9">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || isCreating || isUpdating || !form.name || !form.prepTime || !form.categoryId}
          >
            {isSubmitting ? 'Guardando...' : editing ? 'Guardar' : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DishEditDialog
