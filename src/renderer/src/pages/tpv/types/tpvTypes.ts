import type { PaymentMethodEnum } from '@api/api'

export interface CreatePaymentPayload {
  order: { id: string }
  method: PaymentMethodEnum
  amount: number
  transactionId?: string
}

export interface CreateCashDrawerPayload {
  employee: { id: string }
  openingBalance: number
  openedAt: string
  closingBalance: number
  expectedBalance: number
}

export interface UpdateCashDrawerPayload {
  closedAt?: string
  closingBalance?: number
  expectedBalance?: number
}

export interface AddOrderDishPayload {
  dishId: string
  count: number
  total: number
}

export interface AddOrderConsumablePayload {
  productId: string
  count: number
  total: number
}

export interface UpdateOrderItemsPayload {
  orderDishes?: AddOrderDishPayload[]
  orderConsumableItems?: AddOrderConsumablePayload[]
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodEnum, string> = {
  CASH: 'Efectivo',
  CREDIT_CARD: 'Tarjeta crédito',
  DEBIT_CARD: 'Tarjeta débito',
  ONLINE: 'Online',
  TRANSFER: 'Transferencia'
}
