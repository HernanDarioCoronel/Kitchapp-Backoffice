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
import { Table, TableCell, TableHeader, TableRow } from '@renderer/components/ui/table'
import { Check, X } from 'lucide-react'

interface ProductDetailDialogProps {
  productId: UUID
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: string | ReactNode
}
const defaultButtonContent = (
  <button className="px-4 py-2 bg-primary text-white rounded">Ver Detalles</button>
)
function ProductDetailDialog({
  productId,
  open,
  onOpenChange,
  children = defaultButtonContent
}: ProductDetailDialogProps): JSX.Element {
  const { data: dish, isLoading, isError, error } = useGetDishById(productId, true)

  if (isLoading) return <div className="flex justify-center items-center">Cargando...</div>
  if (isError)
    return <div className="flex justify-center items-center">Error: {(error as Error).message}</div>
  if (!dish) {
    return <div className="flex justify-center items-center">No se encontró el plato</div>
  }

  const cost = dish.dishIngredientList?.reduce(({ product, quantity }) => {
    if (!product) return 0
    return product.cost * quantity
  }, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card p-6 rounded-lg max-w-fit!">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{dish.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row gap-x-2">
          <div className="w-96">
            <img
              src={`${dish.imageUrl ?? placeholderImg}`}
              alt="Plato"
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <p className="mb-4">{dish.description}</p>
            <div>
              <p className="font-bold text-lg">${(cost ?? 0).toFixed(2)}</p>
            </div>
          </div>
          <div className="w-fit">
            {dish.dishIngredientList && dish.dishIngredientList.length > 0 && (
              <Table className="inline-block mr-2">
                <TableHeader>
                  <TableRow>
                    <TableCell>Ingrediente</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Kcal P/100g</TableCell>
                    <TableCell>Requerido</TableCell>
                  </TableRow>
                </TableHeader>
                {dish.dishIngredientList.map(({ id, optional, product, quantity }) => (
                  <TableRow key={id}>
                    <TableCell>{product?.name}</TableCell>
                    <TableCell>
                      {quantity} {product?.unitType?.abbreviation}
                    </TableCell>
                    <TableCell>{product?.caloriesPer100g ?? 0}Kcal</TableCell>
                    <TableCell>{!optional ? <Check /> : <X />}</TableCell>
                  </TableRow>
                ))}
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailDialog
