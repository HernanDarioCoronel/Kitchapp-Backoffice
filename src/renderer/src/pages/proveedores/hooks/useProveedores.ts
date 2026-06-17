import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSupplier,
  deleteSupplierById,
  fetchSuppliers,
  updateSupplier
} from '../api/proveedores'
import { Supplier } from '@api/api'

export const supplierKeys = { root: ['suppliers'] as const }

export function useSuppliers() {
  return useQuery<Supplier[]>({ queryKey: supplierKeys.root, queryFn: fetchSuppliers })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Supplier, unknown, Supplier>({
    mutationFn: createSupplier,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supplierKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Supplier,
    unknown,
    { id: string; payload: Supplier }
  >({
    mutationFn: ({ id, payload }) => updateSupplier(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supplierKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteSupplierById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supplierKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}
