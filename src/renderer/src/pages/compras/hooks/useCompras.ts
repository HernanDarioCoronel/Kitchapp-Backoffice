import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPurchaseOrder,
  deletePurchaseOrderById,
  fetchPurchaseOrders,
  updatePurchaseOrder
} from '../api/compras'
import { PurchaseOrder } from '@api/api'

export const purchaseOrderKeys = { root: ['purchase-orders'] as const }

export function usePurchaseOrders() {
  return useQuery<PurchaseOrder[]>({
    queryKey: purchaseOrderKeys.root,
    queryFn: fetchPurchaseOrders
  })
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    PurchaseOrder,
    unknown,
    PurchaseOrder
  >({
    mutationFn: createPurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    PurchaseOrder,
    unknown,
    { id: string; payload: PurchaseOrder }
  >({
    mutationFn: ({ id, payload }) => updatePurchaseOrder(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deletePurchaseOrderById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}
