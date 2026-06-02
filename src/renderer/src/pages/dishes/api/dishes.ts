import apiClient from '@/lib/api-client'
import type { Dish } from '@api/api'
import { UUID } from 'crypto'

export interface DishIngredientPayload {
  id?: string
  product?: { id?: string }
  quantity?: number
  optional?: boolean
}

export interface DishPayload {
  name?: string
  description?: string
  prepTime?: number
  price?: number
  dishCategory?: { id?: string }
  isAvailable?: boolean
  imageUrl?: string
  dishIngredientList?: DishIngredientPayload[]
}

export async function fetchDishes(): Promise<Dish[]> {
  const { data } = await apiClient.get<Dish[]>('/dishes?withIngredients=1')
  return data
}

export async function fetchDishById(dishId: UUID, withIngredients: boolean = false): Promise<Dish> {
  const { data } = await apiClient.get<Dish>(
    `/dishes/${dishId}${withIngredients ? '?withIngredients=1' : ''}`
  )
  return data
}

export async function createDish(payload: DishPayload): Promise<Dish> {
  const { data } = await apiClient.post<Dish>('/dishes', payload)
  return data
}

export async function updateDish(dishId: UUID, payload: DishPayload): Promise<Dish> {
  const { data } = await apiClient.patch<Dish>(`/dishes/${dishId}`, payload)
  return data
}

export async function deleteDishById(dishId: UUID): Promise<void> {
  await apiClient.delete(`/dishes/${dishId}`)
}
