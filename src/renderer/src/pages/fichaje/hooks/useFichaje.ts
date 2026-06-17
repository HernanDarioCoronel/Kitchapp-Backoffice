import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createWorkLog, fetchWorkLogs } from '../api/fichaje'
import type { CreateWorkLogPayload, WorkLog, WorkLogsFilters } from '../types/fichajeTypes'

export const workLogKeys = {
  all: ['work-logs'] as const,
  filtered: (filters: WorkLogsFilters) => ['work-logs', filters] as const
}

export function useWorkLogs(
  filters?: WorkLogsFilters,
  enabled = true
): {
  data: WorkLog[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
} {
  const { data, isLoading, isError, error } = useQuery<WorkLog[]>({
    queryKey: filters ? workLogKeys.filtered(filters) : workLogKeys.all,
    queryFn: () => fetchWorkLogs(filters),
    enabled
  })
  return { data, isLoading, isError, error }
}

export function useCreateWorkLog(): {
  mutateAsync: (payload: CreateWorkLogPayload) => Promise<WorkLog>
  isPending: boolean
  isError: boolean
} {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError } = useMutation<WorkLog, unknown, CreateWorkLogPayload>({
    mutationFn: createWorkLog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workLogKeys.all })
  })
  return { mutateAsync, isPending, isError }
}
