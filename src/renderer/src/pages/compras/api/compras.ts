import apiClient from '@/lib/api-client'
import { PurchaseOrder } from '@api/api'

export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  const { data } = await apiClient.get<PurchaseOrder[]>('/purchase-orders')
  return data
}

export async function createPurchaseOrder(payload: PurchaseOrder): Promise<PurchaseOrder> {
  const { data } = await apiClient.post<PurchaseOrder>('/purchase-orders', payload)
  return data
}

export async function updatePurchaseOrder(
  id: string,
  payload: PurchaseOrder
): Promise<PurchaseOrder> {
  const { data } = await apiClient.patch<PurchaseOrder>(`/purchase-orders/${id}`, payload)
  return data
}

export async function deletePurchaseOrderById(id: string): Promise<void> {
  await apiClient.delete(`/purchase-orders/${id}`)
}
