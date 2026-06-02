import apiClient from '@/lib/api-client'
import { OrderStatusEnum } from '@api/api'
import type { Order } from '@api/api'

export interface OrderDishPayload {
  dish: { id: string }
  count: number
}

export interface OrderConsumableItemPayload {
  product: { id: string }
  count: number
}

export interface CreateOrderPayload {
  status: OrderStatusEnum
  orderDishes?: OrderDishPayload[]
  orderConsumableItems?: OrderConsumableItemPayload[]
}

export interface UpdateOrderPayload {
  status?: OrderStatusEnum
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/orders')
  return data
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<Order>('/orders', payload)
  return data
}

export async function updateOrder(id: string, payload: UpdateOrderPayload): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/orders/${id}`, payload)
  return data
}
