import apiClient from '@/lib/api-client'
import { Category, Product, ProductRequest, UnitType } from '@api/api'
import { UUID } from 'crypto'

export enum ProductRequestType {
  ALL = 0,
  INGREDIENT = 1,
  PRODUCT = 2
}

export type ProductPayload = ProductRequest & { imageUrl?: string }

export async function fetchProducts(
  type: ProductRequestType = ProductRequestType.ALL
): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>(`/products?type=${type}`)
  return data
}

export async function fetchProductById(productId: UUID): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${productId}`)
  return data
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', payload)
  return data
}

export async function updateProduct(productId: UUID, payload: ProductPayload): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${productId}`, payload)
  return data
}

export async function deleteProductById(productId: UUID): Promise<void> {
  await apiClient.delete(`/products/${productId}`)
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

export async function fetchUnitTypes(): Promise<UnitType[]> {
  const { data } = await apiClient.get<UnitType[]>('/unit-types')
  return data
}
