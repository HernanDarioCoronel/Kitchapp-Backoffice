import apiClient from '@/lib/api-client'
import { InventoryMovement, Stock } from '@api/api'

// ─── Stock ────────────────────────────────────────────────────────────────────

export async function fetchStock(): Promise<Stock[]> {
  const { data } = await apiClient.get<Stock[]>('/stock')
  return data
}

export async function createStock(payload: Stock): Promise<Stock> {
  const { data } = await apiClient.post<Stock>('/stock', payload)
  return data
}

export async function updateStock(id: string, payload: Stock): Promise<Stock> {
  const { data } = await apiClient.patch<Stock>(`/stock/${id}`, payload)
  return data
}

export async function deleteStockById(id: string): Promise<void> {
  await apiClient.delete(`/stock/${id}`)
}

// ─── Inventory Movements ──────────────────────────────────────────────────────

export async function fetchInventoryMovements(): Promise<InventoryMovement[]> {
  const { data } = await apiClient.get<InventoryMovement[]>('/inventory-movements')
  return data
}

export async function createInventoryMovement(
  payload: InventoryMovement
): Promise<InventoryMovement> {
  const { data } = await apiClient.post<InventoryMovement>('/inventory-movements', payload)
  return data
}

export async function deleteInventoryMovementById(id: string): Promise<void> {
  await apiClient.delete(`/inventory-movements/${id}`)
}
