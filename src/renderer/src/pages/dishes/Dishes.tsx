import { JSX, useState } from 'react'
import { useSearch } from '@renderer/components/SearchContext'
import { useDishes, useDeleteDish } from './hooks/useDishes'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import placeholderImg from '@resources/placeholder.jpg'
import { Eye, Timer, Trash2, Plus, Edit2 } from 'lucide-react'
import ProductDetailDialog from './components/ProductDetailDialog'
import DishEditDialog from './components/DishEditDialog'
import { UUID } from 'crypto'
import DialogButton from '@renderer/components/DialogButton'
import { Button } from '@renderer/components/ui/button'
import { Dish } from '@api/api'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return placeholderImg
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${API_BASE}/images/${imageUrl}`
}

function Dishes(): JSX.Element {
  const { data, isLoading, isError, error } = useDishes()
  const { mutate: deleteDish } = useDeleteDish()

  const [selectedDishId, setSelectedDishId] = useState<UUID | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<Dish | null>(null)
  const [formKey, setFormKey] = useState(0)
  const { query } = useSearch()

  function openCreate(): void {
    setEditing(null)
    setFormKey((k) => k + 1)
    setOpenForm(true)
  }

  function openEdit(dish: Dish): void {
    setEditing(dish)
    setFormKey((k) => k + 1)
    setOpenForm(true)
  }

  if (isLoading) return <div className="flex justify-center items-center h-full">Cargando...</div>
  if (isError)
    return (
      <div className="flex justify-center items-center h-full">
        Error: {(error as Error).message}
      </div>
    )

  let filtered = data ?? []
  if (query && query.trim() !== '') {
    const q = query.toLowerCase()
    filtered = filtered.filter(
      (dish) =>
        (dish.name ?? '').toLowerCase().includes(q) ||
        (dish.description ?? '').toLowerCase().includes(q)
    )
  }

  return (
    <div className="h-full flex flex-col gap-4 m-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Platillos</h1>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus /> Agregar platillo
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex justify-center items-center flex-1 text-muted-foreground">
          {data?.length === 0 ? 'No hay platos disponibles' : 'No hay platos que coincidan'}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 items-start">
          {filtered.map((dish) => (
            <Card key={dish.id as UUID} className="relative w-72 flex-none bg-card">
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(dish)}
                >
                  <Edit2 width={16} />
                </Button>
                <DialogButton
                  triggerButtonContent={<Trash2 className="text-destructive" width={20} />}
                  title="Eliminar Plato"
                  description="¿Estás seguro de que quieres eliminar este plato?"
                  type="destructive"
                  onConfirm={() => deleteDish(dish.id as UUID)}
                  confirmText="Eliminar"
                  cancelText="Cancelar"
                />
              </div>
              <CardHeader>
                <h3 className="w-full truncate text-lg font-bold pr-16">{dish.name}</h3>
              </CardHeader>
              <CardContent>
                <div
                  className="mb-4 h-40 w-full rounded-md bg-center bg-cover flex items-end justify-end p-2 hover:*:brightness-110 transition cursor-pointer"
                  style={{ backgroundImage: `url(${getImageUrl(dish.imageUrl)})` }}
                  onClick={() => setSelectedDishId(dish.id as UUID)}
                >
                  <button className="bg-primary text-white rounded p-1">
                    <Eye color="var(--foreground)" />
                  </button>
                </div>
                <p className="truncate">{dish.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <Timer className="inline-block mr-1" />
                    <p className="flex items-center text-sm text-muted-foreground">
                      <span>{dish.prepTime}</span>
                      <span>min</span>
                    </p>
                  </div>
                  <p className="text-right w-full font-bold text-xl">${dish.price!.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DishEditDialog key={formKey} open={openForm} onOpenChange={setOpenForm} editing={editing} />

      {selectedDishId && (
        <ProductDetailDialog
          productId={selectedDishId}
          open={true}
          onOpenChange={(open) => {
            if (!open) setSelectedDishId(null)
          }}
        />
      )}
    </div>
  )
}

export default Dishes
