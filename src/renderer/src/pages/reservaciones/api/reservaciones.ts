import apiClient from '@/lib/api-client'
import type { Reservation } from '@api/api'

export async function fetchReservations(): Promise<Reservation[]> {
  const { data } = await apiClient.get<Reservation[]>('/reservations')
  return data
}

export async function createReservation(payload: Reservation): Promise<Reservation> {
  const { data } = await apiClient.post<Reservation>('/reservations', payload)
  return data
}

export async function updateReservation(id: string, payload: Reservation): Promise<Reservation> {
  const { data } = await apiClient.patch<Reservation>(`/reservations/${id}`, payload)
  return data
}

export async function deleteReservationById(id: string): Promise<void> {
  await apiClient.delete(`/reservations/${id}`)
}
