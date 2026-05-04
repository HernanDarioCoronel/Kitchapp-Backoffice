import { JSX } from 'react'
import { useDishes } from './hooks/useDishes'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import placeholderImg from '@resources/placeholder.jpg'

function Dishes(): JSX.Element {
  const { data, isLoading, isError, error } = useDishes()

  if (isLoading) return <div>Cargando...</div>
  if (isError) return <div>Error: {(error as Error).message}</div>
  if (data?.length === 0) {
    return <div>No hay platos disponibles</div>
  }
  return (
    <div className="flex flex-wrap gap-4 justify-evenly">
      {data?.map((dish) => (
        <Card key={dish.id} className="max-w-56">
          <CardHeader>
            <h3>{dish.name}</h3>
          </CardHeader>

          <CardContent>
            <img
              src={dish.imageUrl ?? placeholderImg}
              alt={dish.name}
              className="w-48 h-48 object-cover mb-4"
            />
            <p>{dish.description}</p>
            <p>Precio: ${dish.price.toFixed(2)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Dishes
