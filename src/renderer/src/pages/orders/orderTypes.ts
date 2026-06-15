import { OrderStatusEnum } from '@api/api'

export type StatusFilter = OrderStatusEnum | 'active' | 'all'
export type ViewMode = 'new-order' | 'list'
export type FilterMode = 'all' | 'dishes' | 'products' | 'selected'
export type OrdersView = 'map' | 'new-order' | 'orders-list'

export const STATUS_LABELS: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.Waiting]: 'En espera',
  [OrderStatusEnum.InPreparation]: 'En preparación',
  [OrderStatusEnum.Done]: 'Listo',
  [OrderStatusEnum.Delivered]: 'Entregado',
  [OrderStatusEnum.Paid]: 'Pagado'
}

export const STATUS_COLORS: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.Waiting]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [OrderStatusEnum.InPreparation]: 'bg-blue-100 text-blue-800 border-blue-300',
  [OrderStatusEnum.Done]: 'bg-green-100 text-green-800 border-green-300',
  [OrderStatusEnum.Delivered]: 'bg-purple-100 text-purple-800 border-purple-300',
  [OrderStatusEnum.Paid]: 'bg-gray-100 text-gray-800 border-gray-300'
}
