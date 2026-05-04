import apiClient from '@/lib/api-client'
import { Dish } from '../types/dish'

export async function fetchDishes(): Promise<Dish[]> {
  const { data } = await apiClient.get<Dish[]>('/dishes')
  return data
}
