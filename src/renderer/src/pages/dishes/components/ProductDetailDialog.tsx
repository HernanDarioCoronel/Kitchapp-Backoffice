import { Dialog, DialogContent, DialogTrigger } from '@renderer/components/ui/dialog'
import { JSX, ReactNode } from 'react'
import { UUID } from 'crypto'
import { useGetDishById } from '../hooks/useDishes'
import placeholderImg from '@resources/placeholder.jpg'

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
  const { data: dish, isLoading, isError, error } = useGetDishById(productId)

  if (isLoading) return <div className="flex justify-center items-center">Cargando...</div>
  if (isError)
    return <div className="flex justify-center items-center">Error: {(error as Error).message}</div>
  if (!dish) {
    return <div className="flex justify-center items-center">No se encontró el plato</div>
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{dish.name}</h2>
        <img
          src={`${dish.imageUrl ?? placeholderImg}`}
          alt="Plato"
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <p className="mb-4">{dish.description}</p>
        <div>
          <p className="font-bold text-lg">${dish.price!.toFixed(2)}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailDialog
