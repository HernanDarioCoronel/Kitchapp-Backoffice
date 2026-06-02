import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchOrders,
  createOrder,
  updateOrder,
  CreateOrderPayload,
  UpdateOrderPayload
} from '../api/orders'
import type { Order } from '@api/api'

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
