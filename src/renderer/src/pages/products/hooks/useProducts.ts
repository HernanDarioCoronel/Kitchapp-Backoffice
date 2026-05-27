import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProductById,
  fetchCategories,
  fetchProductById,
  fetchProducts,
  fetchUnitTypes,
  ProductRequestType,
  updateProduct
} from '../api/products'
import { UUID } from 'crypto'
import { Category, Product, ProductRequest, UnitType } from '@api/index'

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
  root: ['products'] as const,
  list: (type: ProductRequestType) => ['products', type] as const,
  details: (id: UUID) => ['products', id] as const
}

export function useProducts(type: ProductRequestType): UseProductsResult {
  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: productKeys.list(type),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.root })
  })
  return { mutate: (id: UUID) => mutate(id), isLoading: isPending, isError, isSuccess }
}

export function useCreateProduct(): {
  mutate: (payload: ProductRequest) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Product, unknown, ProductRequest>({
    mutationFn: (payload: ProductRequest) => createProduct(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.root })
  })
  return {
    mutate: (payload: ProductRequest) => mutate(payload),
    isLoading: isPending,
    isError,
    isSuccess
  }
}

export function useUpdateProduct(): {
  mutate: (args: { id: UUID; payload: ProductRequest }) => void
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Product,
    unknown,
    { id: UUID; payload: ProductRequest }
  >({
    mutationFn: ({ id, payload }: { id: UUID; payload: ProductRequest }) =>
      updateProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.root })
  })
  return {
    mutate: (args: { id: UUID; payload: ProductRequest }) => mutate(args),
    isLoading: isPending,
    isError,
    isSuccess
  }
}

export function useCategories(): { data: Category[] | undefined; isLoading: boolean } {
  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories
  })
  return { data, isLoading }
}

export function useUnitTypes(): { data: UnitType[] | undefined; isLoading: boolean } {
  const { data, isLoading } = useQuery<UnitType[]>({
    queryKey: ['unit-types'],
    queryFn: fetchUnitTypes
  })
  return { data, isLoading }
}
