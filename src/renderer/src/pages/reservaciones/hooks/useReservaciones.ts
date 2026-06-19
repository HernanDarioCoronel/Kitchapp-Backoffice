import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Reservation } from '@api/api'
import {
  createReservation,
  deleteReservationById,
  fetchReservations,
  updateReservation
} from '../api/reservaciones'

const reservationKeys = { root: ['reservations'] as const }

export function useReservaciones() {
  return useQuery<Reservation[]>({ queryKey: reservationKeys.root, queryFn: fetchReservations })
}

export function useCreateReservacion() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Reservation,
    unknown,
    Reservation
  >({
    mutationFn: createReservation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reservationKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useUpdateReservacion() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<
    Reservation,
    unknown,
    { id: string; payload: Reservation }
  >({
    mutationFn: ({ id, payload }) => updateReservation(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reservationKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}

export function useDeleteReservacion() {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation<void, unknown, string>({
    mutationFn: deleteReservationById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reservationKeys.root })
  })
  return { mutate, isLoading: isPending, isError, isSuccess }
}
