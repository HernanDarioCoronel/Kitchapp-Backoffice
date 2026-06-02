import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDish, deleteDishById, fetchDishById, fetchDishes, updateDish, DishPayload } from '../api/dishes'
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

export function useCreateDish(): {
  mutate: (payload: DishPayload) => void
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError } = useMutation<Dish, unknown, DishPayload>({
    mutationFn: createDish,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dishkeys.all })
  })
  return { mutate, isPending, isError }
}

export function useUpdateDish(): {
  mutate: (args: { id: UUID; payload: DishPayload }) => void
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError } = useMutation<Dish, unknown, { id: UUID; payload: DishPayload }>({
    mutationFn: ({ id, payload }) => updateDish(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: dishkeys.all })
      queryClient.invalidateQueries({ queryKey: dishkeys.details(id) })
    }
  })
  return { mutate, isPending, isError }
}

export function useDeleteDishById(dishId: UUID): {
  mutate: () => void
  isSuccess: boolean
  isPaused: boolean
  isPending: boolean
  isError: boolean
  mutateAsync: () => Promise<void>
} {
  const queryClient = useQueryClient()
  const { mutate, isSuccess, isPaused, isPending, isError, mutateAsync } = useMutation({
    mutationFn: () => deleteDishById(dishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dishkeys.all })
    }
  })
  return { mutate, isSuccess, isPaused, isPending, isError, mutateAsync }
}

export function useDeleteDish(): {
  mutate: (dishId: UUID) => void
  mutateAsync: (dishId: UUID) => Promise<void>
  isPending: boolean
  isError: boolean
  isSuccess: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, isPending, isError, isSuccess } = useMutation({
    mutationFn: (dishId: UUID) => deleteDishById(dishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dishkeys.all })
    }
  })
  return {
    mutate: (dishId: UUID) => mutate(dishId),
    mutateAsync: (dishId: UUID) => mutateAsync(dishId),
    isPending,
    isError,
    isSuccess
  }
}
