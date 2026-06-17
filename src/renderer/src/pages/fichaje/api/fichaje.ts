import apiClient from '@/lib/api-client'
import type { CreateWorkLogPayload, WorkLog, WorkLogsFilters } from '../types/fichajeTypes'

export async function fetchWorkLogs(filters?: WorkLogsFilters): Promise<WorkLog[]> {
  const params: Record<string, string> = {}
  if (filters?.employeeId) params.employeeId = filters.employeeId
  if (filters?.from) params.from = filters.from
  if (filters?.to) params.to = filters.to
  if (filters?.type) params.type = filters.type

  const { data } = await apiClient.get<WorkLog[]>('/work-logs', { params })
  return data
}

export async function createWorkLog(payload: CreateWorkLogPayload): Promise<WorkLog> {
  const { data } = await apiClient.post<WorkLog>('/work-logs', {
    id: crypto.randomUUID(),
    ...payload
  })
  return data
}
