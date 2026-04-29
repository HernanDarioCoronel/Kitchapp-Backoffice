import { Dish } from '../types/dish'

export async function fetchDishes(): Promise<Dish[]> {
  const res = await fetch(`${process.env.API_URL}/dishes`)
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}
