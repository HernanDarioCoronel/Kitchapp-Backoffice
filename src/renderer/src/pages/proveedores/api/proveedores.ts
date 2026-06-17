import apiClient from '@/lib/api-client'
import { Supplier } from '@api/api'

export async function fetchSuppliers(): Promise<Supplier[]> {
  const { data } = await apiClient.get<Supplier[]>('/suppliers')
  return data
}

export async function createSupplier(payload: Supplier): Promise<Supplier> {
  const { data } = await apiClient.post<Supplier>('/suppliers', payload)
  return data
}

export async function updateSupplier(id: string, payload: Supplier): Promise<Supplier> {
  const { data } = await apiClient.patch<Supplier>(`/suppliers/${id}`, payload)
  return data
}

export async function deleteSupplierById(id: string): Promise<void> {
  await apiClient.delete(`/suppliers/${id}`)
}
