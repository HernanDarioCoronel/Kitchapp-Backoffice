import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { JSX, ReactNode } from 'react'
import { UUID } from 'crypto'
import { useGetDishById } from '../hooks/useDishes'
import placeholderImg from '@resources/placeholder.jpg'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return placeholderImg
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${API_BASE}/images/${imageUrl}`
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { Badge } from '@renderer/components/ui/badge'
import { Separator } from '@renderer/components/ui/separator'
import {
  Check,
  X,
  Clock,
  Tag,
  Layers,
  AlertTriangle,
  ShoppingBasket,
  CalendarDays,
  Flame,
  DollarSign
} from 'lucide-react'

interface ProductDetailDialogProps {
  productId: UUID
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: string | ReactNode
}

function InfoRow({
  icon,
  label,
  value
}: {
  icon: ReactNode
  label: string
  value: ReactNode
}): JSX.Element {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground font-medium w-32 shrink-0">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}

function ProductDetailDialog({
  productId,
  open,
  onOpenChange,
  children
}: ProductDetailDialogProps): JSX.Element {
  const { data: dish, isLoading, isError, error } = useGetDishById(productId, true)

  const totalCalories = dish?.dishIngredientList?.reduce((acc, { product, quantity }) => {
    if (!product?.caloriesPer100g || !quantity) return acc
    return acc + (product.caloriesPer100g * quantity) / 100
  }, 0)

  const formattedDate = dish?.createdAt
    ? new Date(dish.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : '—'

  const allAllergens =
    dish?.dishIngredientList?.flatMap(({ product }) =>
      product?.allergens ? Array.from(product.allergens) : []
    ) ?? []

  const uniqueAllergens = Array.from(new Map(allAllergens.map((a) => [a.id, a])).values())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="bg-card p-0 rounded-xl max-w-3xl! overflow-hidden">
        {isLoading && (
          <div className="flex justify-center items-center p-8 text-muted-foreground h-52">
            Cargando...
          </div>
        )}
        {isError && (
          <div className="flex justify-center items-center p-8 text-destructive h-52">
            Error: {(error as Error).message}
          </div>
        )}
        {!isLoading && !isError && !dish && (
          <div className="flex justify-center items-center p-8 text-muted-foreground h-52">
            No se encontró el plato
          </div>
        )}
        {dish && (
          <>
            {/* Header image band */}
            <div className="relative h-52 w-full overflow-hidden">
              <img
                src={getImageUrl(dish.imageUrl)}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

              {/* Availability badge — left side so it doesn't overlap the X close button */}
              <div className="absolute top-3 left-3">
                <Badge
                  variant={dish.isAvailable ? 'default' : 'destructive'}
                  className="gap-1 text-xs font-semibold"
                >
                  {dish.isAvailable ? (
                    <>
                      <Check className="w-3 h-3" /> Disponible
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" /> No disponible
                    </>
                  )}
                </Badge>
              </div>

              {/* Title over image */}
              <div className="absolute bottom-0 left-0 p-5">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white drop-shadow">
                    {dish.name}
                  </DialogTitle>
                  {dish.dishCategory && (
                    <p className="text-white/80 text-sm mt-0.5">{dish.dishCategory.name}</p>
                  )}
                </DialogHeader>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              {/* Description */}
              {dish.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{dish.description}</p>
              )}

              {/* Key metrics row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted/50 px-4 py-3 flex flex-col items-center gap-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Precio</span>
                  <span className="font-bold text-lg">${(dish.price ?? 0).toFixed(2)}</span>
                </div>
                <div className="rounded-lg bg-muted/50 px-4 py-3 flex flex-col items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Prep. tiempo</span>
                  <span className="font-bold text-lg">
                    {dish.prepTime ?? '—'}
                    <span className="text-sm font-normal"> min</span>
                  </span>
                </div>
                <div className="rounded-lg bg-muted/50 px-4 py-3 flex flex-col items-center gap-1">
                  <Flame className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Calorías tot.</span>
                  <span className="font-bold text-lg">
                    {totalCalories ? totalCalories.toFixed(0) : '—'}
                    <span className="text-sm font-normal"> kcal</span>
                  </span>
                </div>
              </div>

              <Separator />

              {/* General info */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-foreground mb-1">Información general</h3>
                <InfoRow
                  icon={<Tag className="w-4 h-4" />}
                  label="Categoría"
                  value={
                    dish.dishCategory ? (
                      <span className="flex items-center gap-1">
                        {dish.dishCategory.name}
                        {dish.dishCategory.type && (
                          <Badge variant="outline" className="text-xs ml-1">
                            {dish.dishCategory.type}
                          </Badge>
                        )}
                        {dish.dishCategory.active === false && (
                          <Badge variant="destructive" className="text-xs ml-1">
                            Inactiva
                          </Badge>
                        )}
                      </span>
                    ) : (
                      '—'
                    )
                  }
                />
                <InfoRow
                  icon={<CalendarDays className="w-4 h-4" />}
                  label="Creado el"
                  value={formattedDate}
                />
              </div>

              {/* Allergens */}
              {uniqueAllergens.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Allergens
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueAllergens.map((allergen) => (
                        <Badge
                          key={allergen.id}
                          variant="outline"
                          className="border-amber-400 text-amber-600 dark:text-amber-400 text-xs"
                        >
                          {allergen.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Ingredients table */}
              {dish.dishIngredientList && dish.dishIngredientList.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      Ingredientes
                    </h3>
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-xs">Ingrediente</TableHead>
                            <TableHead className="text-xs">SKU</TableHead>
                            <TableHead className="text-xs">Categoría</TableHead>
                            <TableHead className="text-xs">Cantidad</TableHead>
                            <TableHead className="text-xs">Kcal/100g</TableHead>
                            <TableHead className="text-xs">Tipo</TableHead>
                            <TableHead className="text-xs">Requerido</TableHead>
                            <TableHead className="text-xs">Activo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dish.dishIngredientList.map(({ id, optional, product, quantity }) => (
                            <TableRow key={id}>
                              <TableCell className="font-medium text-sm">
                                {product?.name ?? '—'}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground font-mono">
                                {product?.sku ?? '—'}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {product?.category?.name ?? '—'}
                              </TableCell>
                              <TableCell className="text-sm">
                                {quantity} {product?.unitType?.abbreviation ?? ''}
                              </TableCell>
                              <TableCell className="text-sm">
                                {product?.caloriesPer100g != null
                                  ? `${product.caloriesPer100g} kcal`
                                  : '—'}
                              </TableCell>
                              <TableCell>
                                {product?.type && (
                                  <Badge variant="secondary" className="text-xs">
                                    {product.type}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {!optional ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell>
                                {product?.isActive ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-destructive" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailDialog
