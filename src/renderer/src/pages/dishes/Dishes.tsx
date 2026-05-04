import { JSX } from 'react'
import { useDishes } from './hooks/useDishes'

function Dishes(): JSX.Element {
  const { data, isLoading, isError, error } = useDishes()

  if (isLoading) return <div>Cargando...</div>
  if (isError) return <div>Error: {(error as Error).message}</div>
  if (data?.length === 0) {
    return <div>No hay platos disponibles</div>
  }
  return (
    <div>
      {data?.map((dish) => (
        <div key={dish.id}>{dish.name}</div>
      ))}
    </div>
  )
}

export default Dishes
