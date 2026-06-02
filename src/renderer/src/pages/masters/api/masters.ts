import apiClient from '@/lib/api-client'
import { Allergen, Category, RestaurantTable, Tax, UnitType } from '@api/api'

// Allergens
export async function fetchAllergens(): Promise<Allergen[]> {
  const { data } = await apiClient.get<Allergen[]>('/allergens')
  return data
}
export async function createAllergen(payload: Allergen): Promise<Allergen> {
  const { data } = await apiClient.post<Allergen>('/allergens', payload)
  return data
}
export async function updateAllergen(id: string, payload: Allergen): Promise<Allergen> {
  const { data } = await apiClient.patch<Allergen>(`/allergens/${id}`, payload)
  return data
}
export async function deleteAllergenById(id: string): Promise<void> {
  await apiClient.delete(`/allergens/${id}`)
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}
export async function createCategory(payload: Category): Promise<Category> {
  const { data } = await apiClient.post<Category>('/categories', payload)
  return data
}
export async function updateCategory(id: string, payload: Category): Promise<Category> {
  const { data } = await apiClient.patch<Category>(`/categories/${id}`, payload)
  return data
}
export async function deleteCategoryById(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}

// Tables
export async function fetchTables(): Promise<RestaurantTable[]> {
  const { data } = await apiClient.get<RestaurantTable[]>('/tables')
  return data
}
export async function createTable(payload: RestaurantTable): Promise<RestaurantTable> {
  const { data } = await apiClient.post<RestaurantTable>('/tables', payload)
  return data
}
export async function updateTable(id: string, payload: RestaurantTable): Promise<RestaurantTable> {
  const { data } = await apiClient.patch<RestaurantTable>(`/tables/${id}`, payload)
  return data
}
export async function deleteTableById(id: string): Promise<void> {
  await apiClient.delete(`/tables/${id}`)
}

// Taxes
export async function fetchTaxes(): Promise<Tax[]> {
  const { data } = await apiClient.get<Tax[]>('/taxes')
  return data
}
export async function createTax(payload: Tax): Promise<Tax> {
  const { data } = await apiClient.post<Tax>('/taxes', payload)
  return data
}
export async function updateTax(id: string, payload: Tax): Promise<Tax> {
  const { data } = await apiClient.patch<Tax>(`/taxes/${id}`, payload)
  return data
}
export async function deleteTaxById(id: string): Promise<void> {
  await apiClient.delete(`/taxes/${id}`)
}

// Unit Types
export async function fetchUnitTypes(): Promise<UnitType[]> {
  const { data } = await apiClient.get<UnitType[]>('/unit-types')
  return data
}
export async function createUnitType(payload: UnitType): Promise<UnitType> {
  const { data } = await apiClient.post<UnitType>('/unit-types', payload)
  return data
}
export async function updateUnitType(id: string, payload: UnitType): Promise<UnitType> {
  const { data } = await apiClient.patch<UnitType>(`/unit-types/${id}`, payload)
  return data
}
export async function deleteUnitTypeById(id: string): Promise<void> {
  await apiClient.delete(`/unit-types/${id}`)
}
