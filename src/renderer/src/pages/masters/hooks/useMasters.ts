import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAllergen,
  createCategory,
  createEmployee,
  createLayer,
  createTable,
  createTax,
  createUnitType,
  deleteAllergenById,
  deleteCategoryById,
  deleteEmployeeById,
  deleteLayerById,
  deleteTableById,
  deleteTaxById,
  deleteUnitTypeById,
  fetchAllergens,
  fetchCategories,
  fetchEmployees,
  fetchLayers,
  fetchTableOccupations,
  fetchTables,
  fetchTaxes,
  fetchUnitTypes,
  updateAllergen,
  updateCategory,
  updateEmployee,
  updateLayer,
  updateTable,
  updateTax,
  updateUnitType
} from '../api/masters'
import { Allergen, Category, Employee, Layer, RestaurantTable, TableOccupation, Tax, UnitType } from '@api/index'

// ─── Allergens ───────────────────────────────────────────────────────────────

export const allergenKeys = { root: ['allergens'] as const }

export function useAllergens() {
  return useQuery<Allergen[]>({ queryKey: allergenKeys.root, queryFn: fetchAllergens })
}

export function useCreateAllergen() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Allergen, unknown, Allergen>({
    mutationFn: createAllergen,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: allergenKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateAllergen() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Allergen,
    unknown,
    { id: string; payload: Allergen }
  >({
    mutationFn: ({ id, payload }) => updateAllergen(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: allergenKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteAllergen() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteAllergenById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: allergenKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

// ─── Categories ──────────────────────────────────────────────────────────────

export const categoryKeys = { root: ['categories'] as const }

export function useCategoriesMasters() {
  return useQuery<Category[]>({ queryKey: categoryKeys.root, queryFn: fetchCategories })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Category, unknown, Category>({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Category,
    unknown,
    { id: string; payload: Category }
  >({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteCategoryById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

// ─── Tables ───────────────────────────────────────────────────────────────────

export const tableKeys = { root: ['tables'] as const }

export function useTables() {
  return useQuery<RestaurantTable[]>({ queryKey: tableKeys.root, queryFn: fetchTables })
}

export function useCreateTable() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    RestaurantTable,
    unknown,
    RestaurantTable
  >({
    mutationFn: createTable,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tableKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateTable() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    RestaurantTable,
    unknown,
    { id: string; payload: RestaurantTable }
  >({
    mutationFn: ({ id, payload }) => updateTable(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tableKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteTable() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteTableById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tableKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

// ─── Taxes ────────────────────────────────────────────────────────────────────

export const taxKeys = { root: ['taxes'] as const }

export function useTaxes() {
  return useQuery<Tax[]>({ queryKey: taxKeys.root, queryFn: fetchTaxes })
}

export function useCreateTax() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Tax, unknown, Tax>({
    mutationFn: createTax,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taxKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateTax() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Tax,
    unknown,
    { id: string; payload: Tax }
  >({
    mutationFn: ({ id, payload }) => updateTax(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taxKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteTax() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteTaxById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taxKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

// ─── Employees ────────────────────────────────────────────────────────────────

export const employeeKeys = { root: ['employees'] as const }

export function useEmployees() {
  return useQuery<Employee[]>({ queryKey: employeeKeys.root, queryFn: fetchEmployees })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Employee, unknown, Employee>({
    mutationFn: createEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Employee,
    unknown,
    { id: string; payload: Employee }
  >({
    mutationFn: ({ id, payload }) => updateEmployee(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteEmployeeById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

// ─── Table Occupations ────────────────────────────────────────────────────────

export const tableOccupationKeys = { root: ['table-occupations'] as const }

export function useTableOccupations() {
  return useQuery<TableOccupation[]>({
    queryKey: tableOccupationKeys.root,
    queryFn: fetchTableOccupations
  })
}

// ─── Layers ───────────────────────────────────────────────────────────────────

export const layerKeys = { root: ['layers'] as const }

export function useLayers() {
  return useQuery<Layer[]>({ queryKey: layerKeys.root, queryFn: fetchLayers })
}

export function useCreateLayer() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<Layer, unknown, Layer>({
    mutationFn: createLayer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: layerKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateLayer() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Layer,
    unknown,
    { id: string; payload: Layer }
  >({
    mutationFn: ({ id, payload }) => updateLayer(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: layerKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteLayer() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteLayerById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: layerKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

// ─── Unit Types ───────────────────────────────────────────────────────────────

export const unitTypeKeys = { root: ['unit-types'] as const }

export function useUnitTypesMasters() {
  return useQuery<UnitType[]>({ queryKey: unitTypeKeys.root, queryFn: fetchUnitTypes })
}

export function useCreateUnitType() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<UnitType, unknown, UnitType>({
    mutationFn: createUnitType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: unitTypeKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateUnitType() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    UnitType,
    unknown,
    { id: string; payload: UnitType }
  >({
    mutationFn: ({ id, payload }) => updateUnitType(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: unitTypeKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteUnitType() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteUnitTypeById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: unitTypeKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}
