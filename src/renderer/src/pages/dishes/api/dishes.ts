import apiClient from '@/lib/api-client'
import type { Dish } from '@api/api'
import { UUID } from 'crypto'

export async function fetchDishes(): Promise<Dish[]> {
  const { data } = await apiClient.get<Dish[]>('/dishes')
  return data
}

export async function fetchDishById(dishId: UUID, withIngredients: boolean = false): Promise<Dish> {
  const { data } = await apiClient.get<Dish>(
    `/dishes/${dishId}${withIngredients ? '?withIngredients=1' : ''}`
  )
  return data
}
