import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchPayments,
  createPayment,
  fetchCashDrawers,
  createCashDrawer,
  updateCashDrawer,
  updateOrderItems
} from '../api/tpv'
import type { CashDrawer, Payment } from '@api/api'
import type {
  CreateCashDrawerPayload,
  CreatePaymentPayload,
  UpdateCashDrawerPayload,
  UpdateOrderItemsPayload
} from '../types/tpvTypes'

export const paymentKeys = { all: ['payments'] as const }
export const cashDrawerKeys = { all: ['cash-drawers'] as const }

export function usePayments(): {
  data: Payment[] | undefined
  isLoading: boolean
  isError: boolean
} {
  const { data, isLoading, isError } = useQuery<Payment[]>({
    queryKey: paymentKeys.all,
    queryFn: fetchPayments
  })
  return { data, isLoading, isError }
}

export function useCreatePayment(): {
  mutateAsync: (payload: CreatePaymentPayload) => Promise<Payment>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError } = useMutation<Payment, unknown, CreatePaymentPayload>({
    mutationFn: createPayment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: paymentKeys.all })
  })
  return { mutateAsync, isPending, isError }
}

export function useCashDrawers(): {
  data: CashDrawer[] | undefined
  isLoading: boolean
  isError: boolean
} {
  const { data, isLoading, isError } = useQuery<CashDrawer[]>({
    queryKey: cashDrawerKeys.all,
    queryFn: fetchCashDrawers
  })
  return { data, isLoading, isError }
}

export function useCreateCashDrawer(): {
  mutateAsync: (payload: CreateCashDrawerPayload) => Promise<CashDrawer>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError } = useMutation<
    CashDrawer,
    unknown,
    CreateCashDrawerPayload
  >({
    mutationFn: createCashDrawer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cashDrawerKeys.all })
  })
  return { mutateAsync, isPending, isError }
}

export function useUpdateCashDrawer(): {
  mutateAsync: (args: { id: string; payload: UpdateCashDrawerPayload }) => Promise<CashDrawer>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError } = useMutation<
    CashDrawer,
    unknown,
    { id: string; payload: UpdateCashDrawerPayload }
  >({
    mutationFn: ({ id, payload }) => updateCashDrawer(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cashDrawerKeys.all })
  })
  return { mutateAsync, isPending, isError }
}

export function useUpdateOrderItems(): {
  mutateAsync: (args: { orderId: string; payload: UpdateOrderItemsPayload }) => Promise<void>
  isPending: boolean
} {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation<
    void,
    unknown,
    { orderId: string; payload: UpdateOrderItemsPayload }
  >({
    mutationFn: ({ orderId, payload }) => updateOrderItems(orderId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
  })
  return { mutateAsync, isPending }
}
