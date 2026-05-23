import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProductById,
  fetchProductById,
  fetchProducts,
  ProductRequestType,
  updateProduct
} from '../api/products'
import { UUID } from 'crypto'
import { Product } from '@api/index'

interface UseProductsResult {
  data: Product[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}

interface UseGetProductByIdResult {
  data: Product | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}

export const productKeys = {
  all: ['products'] as const,
  details: (id: UUID) => [...productKeys.all, id] as const
}

export function useProducts(type: ProductRequestType): UseProductsResult {
  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: productKeys.all,
    queryFn: () => fetchProducts(type)
  })
  return { data, isLoading, isError, error }
}

export function useGetProductById(productId: UUID): UseGetProductByIdResult {
  const { data, isLoading, isError, error } = useQuery<Product>({
    queryKey: productKeys.details(productId),
    queryFn: () => fetchProductById(productId),
    enabled: !!productId
  })
  return { data, isLoading, isError, error }
}

export function useDeleteProduct(): {
  mutate: (id: UUID) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, UUID>({
    mutationFn: (id: UUID) => deleteProductById(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all })
  })
  return { mutate: (id: UUID) => mutate(id), isLoading: isPending, isError, isSuccess }
}

export function useCreateProduct(): {
  mutate: (payload: Partial<Product>) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Product, unknown, Partial<Product>>(
    {
      mutationFn: (payload: Partial<Product>) => createProduct(payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all })
    }
  )
  return {
    mutate: (payload: Partial<Product>) => mutate(payload),
    isLoading: isPending,
    isError,
    isSuccess
  }
}

export function useUpdateProduct(): {
  mutate: (args: { id: UUID; payload: Partial<Product> }) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Product,
    unknown,
    { id: UUID; payload: Partial<Product> }
  >({
    mutationFn: ({ id, payload }: { id: UUID; payload: Partial<Product> }) =>
      updateProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all })
  })
  return {
    mutate: (args: { id: UUID; payload: Partial<Product> }) => mutate(args),
    isLoading: isPending,
    isError,
    isSuccess
  }
}
