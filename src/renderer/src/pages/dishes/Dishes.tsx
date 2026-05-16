import { JSX, useState } from 'react'
import { useDishes, useDeleteDish } from './hooks/useDishes'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import placeholderImg from '@resources/placeholder.jpg'
import { Eye, Timer, Trash2 } from 'lucide-react'
import ProductDetailDialog from './components/ProductDetailDialog'
import { UUID } from 'crypto'
import DialogButton from '@renderer/components/DialogButton'

function Dishes(): JSX.Element {
  const { data, isLoading, isError, error } = useDishes()
  const { mutate: deleteDish } = useDeleteDish()
  const [openDialog, setOpenDialog] = useState(false)

  if (isLoading) return <div className="flex justify-center items-center">Cargando...</div>
  if (isError)
    return <div className="flex justify-center items-center">Error: {(error as Error).message}</div>
  if (data?.length === 0) {
    return <div className="flex justify-center items-center">No hay platos disponibles</div>
  }
  return (
    <div className="h-full flex flex-wrap gap-4 m-4 items-start">
      {data?.map((dish) => (
        <Card
          key={dish.id as UUID}
          className="relative w-72 flex-none border-primary border bg-card"
        >
          <div className="absolute top-2 right-2 w-fit">
            <DialogButton
              triggerButtonContent={<Trash2 className="text-destructive" />}
              title="Eliminar Plato"
              description="¿Estás seguro de que quieres eliminar este plato?"
              type="destructive"
              onConfirm={() => deleteDish(dish.id as UUID)}
              confirmText="Eliminar"
              cancelText="Cancelar"
            />
          </div>
          <CardHeader>
            <h3 className="w-full truncate text-lg font-bold">{dish.name}</h3>
          </CardHeader>
          <CardContent>
            <div
              className="
              mb-4 h-40 w-full rounded-md bg-center bg-cover flex items-end
               justify-end p-2 hover:*:brightness-110 transition cursor-pointer"
              style={{ backgroundImage: `url(${dish.imageUrl ?? placeholderImg})` }}
              onClick={() => setOpenDialog(true)}
            >
              <ProductDetailDialog
                productId={dish.id as UUID}
                open={openDialog}
                onOpenChange={setOpenDialog}
              >
                <button className="bg-primary text-white rounded p-1 ">
                  <Eye color="var(--foreground)" />
                </button>
              </ProductDetailDialog>
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
  )
}

export default Dishes
