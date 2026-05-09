import { useQuery } from '@tanstack/react-query'
import { fetchDishById, fetchDishes } from '../api/dishes'
import type { Dish } from '@api/api'
import { UUID } from 'crypto'

interface UseDishesResult {
  data: Dish[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}
interface UseGetDishByIdResult {
  data: Dish | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}

export const dishkeys = {
  all: ['dishes'] as const,
  details: (dishId: UUID) => [...dishkeys.all, dishId] as const
}

export function useDishes(): UseDishesResult {
  const { data, isLoading, isError, error } = useQuery<Dish[]>({
    queryKey: dishkeys.all,
    queryFn: fetchDishes
  })

  return { data, isLoading, isError, error }
}

export function useGetDishById(
  dishId: UUID,
  withIngredients: boolean = false
): UseGetDishByIdResult {
  const { data, isLoading, isError, error } = useQuery<Dish>({
    queryKey: dishkeys.details(dishId),
    queryFn: () => fetchDishById(dishId, withIngredients),
    enabled: !!dishId
  })
  return { data, isLoading, isError, error }
}
