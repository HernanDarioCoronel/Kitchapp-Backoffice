import apiClient from '@/lib/api-client'
import type { CashDrawer, Payment } from '@api/api'
import type {
  CreateCashDrawerPayload,
  CreatePaymentPayload,
  UpdateCashDrawerPayload,
  UpdateOrderItemsPayload
} from '../types/tpvTypes'

export async function fetchPayments(): Promise<Payment[]> {
  const { data } = await apiClient.get<Payment[]>('/payments')
  return data
}

export async function createPayment(payload: CreatePaymentPayload): Promise<Payment> {
  const { data } = await apiClient.post<Payment>('/payments', payload)
  return data
}

export async function fetchCashDrawers(): Promise<CashDrawer[]> {
  const { data } = await apiClient.get<CashDrawer[]>('/cash-drawers')
  return data
}

export async function createCashDrawer(payload: CreateCashDrawerPayload): Promise<CashDrawer> {
  const { data } = await apiClient.post<CashDrawer>('/cash-drawers', payload)
  return data
}

export async function updateCashDrawer(
  id: string,
  payload: UpdateCashDrawerPayload
): Promise<CashDrawer> {
  const { data } = await apiClient.patch<CashDrawer>(`/cash-drawers/${id}`, payload)
  return data
}

export async function updateOrderItems(
  orderId: string,
  payload: UpdateOrderItemsPayload
): Promise<void> {
  await apiClient.patch(`/orders/${orderId}`, payload)
}
