import apiClient from '@/lib/api-client'
import { OrderDishStatusEnum, OrderStatusEnum, TableOccupationStatusEnum } from '@api/api'
import type { Order, OrderDish, TableOccupation } from '@api/api'

export interface CreateOrderDishPayload {
  dishId: string
  count: number
  total: number
}

export interface CreateOrderConsumablePayload {
  productId: string
  count: number
  total: number
}

export interface CreateOrderPayload {
  tableOccupationId: string
  employeeId: string
  orderDishes?: CreateOrderDishPayload[]
  orderConsumables?: CreateOrderConsumablePayload[]
}

export interface UpdateOrderPayload {
  status?: OrderStatusEnum
}

export interface UpdateOrderDishPayload {
  status: OrderDishStatusEnum
}

export interface CreateTableOccupationPayload {
  table: { id: string }
  status: TableOccupationStatusEnum
  startedAt?: string
}

export async function createTableOccupation(
  payload: CreateTableOccupationPayload
): Promise<TableOccupation> {
  const { data } = await apiClient.post<TableOccupation>('/table-occupations', {
    id: crypto.randomUUID(),
    ...payload
  })
  return data
}

export async function closeTableOccupation(id: string): Promise<TableOccupation> {
  const { data } = await apiClient.patch<TableOccupation>(`/table-occupations/${id}`, {
    status: TableOccupationStatusEnum.Closed,
    endedAt: new Date().toISOString()
  })
  return data
}

// kept for backwards-compat with any existing callers
export type OrderDishPayload = CreateOrderDishPayload
export type OrderConsumableItemPayload = CreateOrderConsumablePayload

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/orders')
  return data
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<Order>('/orders', {
    id: crypto.randomUUID(),
    ...payload
  })
  return data
}

export async function updateOrder(id: string, payload: UpdateOrderPayload): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/orders/${id}`, payload)
  return data
}

export async function updateOrderDish(
  orderId: string,
  dishId: string,
  payload: UpdateOrderDishPayload
): Promise<OrderDish> {
  const { data } = await apiClient.patch<OrderDish>(
    `/orders/${orderId}/dishes/${dishId}`,
    payload
  )
  return data
}
