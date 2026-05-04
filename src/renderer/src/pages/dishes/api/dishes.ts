import apiClient from '@/lib/api-client'
import { Dish } from '../types/dish'
import { UUID } from 'crypto'

export async function fetchDishes(): Promise<Dish[]> {
  const { data } = await apiClient.get<Dish[]>('/dishes')
  return data
}

export async function fetchDishById(dishId: UUID): Promise<Dish> {
  const { data } = await apiClient.get<Dish>(`/dishes/${dishId}`)
  return data
}
