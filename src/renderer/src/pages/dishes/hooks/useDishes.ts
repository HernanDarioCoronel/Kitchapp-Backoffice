import { useQuery } from '@tanstack/react-query'
import { fetchDishes } from '../api/dishes'
import { Dish } from '../types/dish'

interface UseDishesResult {
  data: Dish[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}

export function useDishes(): UseDishesResult {
  const { data, isLoading, isError, error } = useQuery<Dish[]>({
    queryKey: ['dishes'],
    queryFn: fetchDishes
  })

  return { data, isLoading, isError, error }
}
