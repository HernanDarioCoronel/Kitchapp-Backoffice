import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createInventoryMovement,
  createStock,
  deleteInventoryMovementById,
  deleteStockById,
  fetchInventoryMovements,
  fetchStock,
  updateStock
} from '../api/almacen'
import { InventoryMovement, Stock } from '@api/api'

// ─── Stock ────────────────────────────────────────────────────────────────────

export const stockKeys = { root: ['stock'] as const }

export function useStock() {
  return useQuery<Stock[]>({ queryKey: stockKeys.root, queryFn: fetchStock })
}

export function useCreateStock() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Stock, unknown, Stock>({
    mutationFn: createStock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: stockKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateStock() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Stock,
    unknown,
    { id: string; payload: Stock }
  >({
    mutationFn: ({ id, payload }) => updateStock(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: stockKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteStock() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteStockById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: stockKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

// ─── Inventory Movements ──────────────────────────────────────────────────────

export const inventoryMovementKeys = { root: ['inventory-movements'] as const }

export function useInventoryMovements() {
  return useQuery<InventoryMovement[]>({
    queryKey: inventoryMovementKeys.root,
    queryFn: fetchInventoryMovements
  })
}

export function useCreateInventoryMovement() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    InventoryMovement,
    unknown,
    InventoryMovement
  >({
    mutationFn: createInventoryMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryMovementKeys.root })
      queryClient.invalidateQueries({ queryKey: stockKeys.root })
    }
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteInventoryMovement() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteInventoryMovementById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inventoryMovementKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}
