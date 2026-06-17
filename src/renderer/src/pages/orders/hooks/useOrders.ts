import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchOrders,
  createOrder,
  updateOrder,
  updateOrderDish,
  updateOrderConsumable,
  createTableOccupation,
  closeTableOccupation,
  CreateOrderPayload,
  UpdateOrderPayload,
  UpdateOrderDishPayload,
  UpdateOrderConsumablePayload,
  CreateTableOccupationPayload
} from '../api/orders'
import type { Order, OrderConsumableItem, OrderDish, TableOccupation } from '@api/api'

export const orderKeys = {
  all: ['orders'] as const
}

export function useOrders(): {
  data: Order[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
} {
  const { data, isLoading, isError, error } = useQuery<Order[]>({
    queryKey: orderKeys.all,
    queryFn: fetchOrders
  })
  return { data, isLoading, isError, error }
}

export function useCreateOrder(): {
  mutate: (payload: CreateOrderPayload) => void
  mutateAsync: (payload: CreateOrderPayload) => Promise<Order>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, isPending, isError } = useMutation<
    Order,
    unknown,
    CreateOrderPayload
  >({
    mutationFn: createOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all })
  })
  return { mutate, mutateAsync, isPending, isError }
}

export function useUpdateOrder(): {
  mutate: (args: { id: string; payload: UpdateOrderPayload }) => void
  mutateAsync: (args: { id: string; payload: UpdateOrderPayload }) => Promise<Order>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, isPending, isError } = useMutation<
    Order,
    unknown,
    { id: string; payload: UpdateOrderPayload }
  >({
    mutationFn: ({ id, payload }) => updateOrder(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all })
  })
  return { mutate, mutateAsync, isPending, isError }
}

export function useCreateTableOccupation(): {
  mutateAsync: (payload: CreateTableOccupationPayload) => Promise<TableOccupation>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError } = useMutation<
    TableOccupation,
    unknown,
    CreateTableOccupationPayload
  >({
    mutationFn: createTableOccupation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['table-occupations'] })
  })
  return { mutateAsync, isPending, isError }
}

export function useCloseTableOccupation(): {
  mutateAsync: (id: string) => Promise<TableOccupation>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError } = useMutation<TableOccupation, unknown, string>({
    mutationFn: closeTableOccupation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table-occupations'] })
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    }
  })
  return { mutateAsync, isPending, isError }
}

export function useUpdateOrderConsumable(): {
  mutateAsync: (args: {
    orderId: string
    itemId: string
    payload: UpdateOrderConsumablePayload
  }) => Promise<OrderConsumableItem>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError } = useMutation<
    OrderConsumableItem,
    unknown,
    { orderId: string; itemId: string; payload: UpdateOrderConsumablePayload }
  >({
    mutationFn: ({ orderId, itemId, payload }) => updateOrderConsumable(orderId, itemId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all })
  })
  return { mutateAsync, isPending, isError }
}

export function useUpdateOrderDish(): {
  mutate: (args: { orderId: string; dishId: string; payload: UpdateOrderDishPayload }) => void
  mutateAsync: (args: {
    orderId: string
    dishId: string
    payload: UpdateOrderDishPayload
  }) => Promise<OrderDish>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, isPending, isError } = useMutation<
    OrderDish,
    unknown,
    { orderId: string; dishId: string; payload: UpdateOrderDishPayload }
  >({
    mutationFn: ({ orderId, dishId, payload }) => updateOrderDish(orderId, dishId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all })
  })
  return { mutate, mutateAsync, isPending, isError }
}
