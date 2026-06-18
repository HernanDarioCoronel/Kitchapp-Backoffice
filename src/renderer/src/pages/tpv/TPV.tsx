import { JSX, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Banknote,
  CheckCircle,
  CreditCard,
  Minus,
  Package,
  Plus,
  Receipt,
  Utensils,
  X
} from 'lucide-react'
import { Order, OrderStatusEnum, PaymentMethodEnum } from '@api/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { Badge } from '@renderer/components/ui/badge'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Skeleton } from '@renderer/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Separator } from '@renderer/components/ui/separator'
import { useDishes } from '@renderer/pages/dishes/hooks/useDishes'
import { useProducts } from '@renderer/pages/products/hooks/useProducts'
import { ProductRequestType } from '@renderer/pages/products/api/products'
import { useEmployees } from '@renderer/pages/masters/hooks/useMasters'
import { useOrders, useUpdateOrder } from '@renderer/pages/orders/hooks/useOrders'
import { STATUS_LABELS, STATUS_COLORS } from '@renderer/pages/orders/orderTypes'
import {
  useCashDrawers,
  useCreateCashDrawer,
  useUpdateCashDrawer,
  usePayments,
  useCreatePayment
} from './hooks/useTpv'
import { PAYMENT_METHOD_LABELS } from './types/tpvTypes'

const fmt = (n: number): string =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

function orderBaseTotal(order: Order): number {
  return (
    Array.from(order.orderDishes ?? []).reduce((s, d) => s + (d.total ?? 0), 0) +
    (order.tip ?? 0)
  )
}

function TPV(): JSX.Element {
  const [searchParams] = useSearchParams()
  const occupationId = searchParams.get('occupationId')

  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { data: dishes, isLoading: dishesLoading } = useDishes()
  const { data: products, isLoading: productsLoading } = useProducts(ProductRequestType.PRODUCT)
  const { data: employees, isLoading: employeesLoading } = useEmployees()
  const { data: cashDrawers, isLoading: drawersLoading } = useCashDrawers()
  const { data: payments } = usePayments()

  const { mutateAsync: createPaymentMutate, isPending: paying } = useCreatePayment()
  const { mutateAsync: updateOrderMutate, isPending: updatingOrder } = useUpdateOrder()
  const { mutateAsync: createDrawerMutate, isPending: openingDrawer } = useCreateCashDrawer()
  const { mutateAsync: updateDrawerMutate, isPending: closingDrawer } = useUpdateCashDrawer()

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [method, setMethod] = useState<PaymentMethodEnum | null>(null)
  const [cashReceived, setCashReceived] = useState('')
  const [cartDishes, setCartDishes] = useState<Map<string, number>>(new Map())
  const [cartProducts, setCartProducts] = useState<Map<string, number>>(new Map())
  const [closingBalance, setClosingBalance] = useState('')
  const [openingBalance, setOpeningBalance] = useState('')
  const [openingEmployeeId, setOpeningEmployeeId] = useState(
    () => localStorage.getItem('lastEmployeeId') ?? ''
  )

  const activeCashDrawer = (cashDrawers ?? []).find((d) => !d.closedAt)
  const pendingOrders = (orders ?? []).filter((o) => o.status !== OrderStatusEnum.Paid)
  const selectedOrder = (orders ?? []).find((o) => o.id === selectedOrderId) ?? null

  const allDishes = dishes ?? []
  const allProducts = products ?? []
  const allEmployees = (employees ?? []).filter((e) => e.isActive)

  useEffect(() => {
    if (!occupationId || !orders) return
    const order = orders.find(
      (o) =>
        (o.tableOccupation as { id?: string })?.id === occupationId &&
        o.status !== OrderStatusEnum.Paid
    )
    if (order) setSelectedOrderId(order.id as string)
  }, [occupationId, orders])

  const additionsTotal = [...cartDishes.entries()].reduce((sum, [id, count]) => {
    const dish = allDishes.find((d) => d.id === id)
    return sum + (dish?.price ?? 0) * count
  }, 0)

  const totalAmount = selectedOrder ? orderBaseTotal(selectedOrder) + additionsTotal : 0
  const received = parseFloat(cashReceived) || 0
  const change = method === PaymentMethodEnum.Cash ? received - totalAmount : 0
  const canCharge =
    selectedOrder !== null &&
    method !== null &&
    (method !== PaymentMethodEnum.Cash || received >= totalAmount)

  function resetPaymentForm(): void {
    setMethod(null)
    setCashReceived('')
    setCartDishes(new Map())
    setCartProducts(new Map())
    setSelectedOrderId(null)
  }

  function selectOrder(order: Order): void {
    setSelectedOrderId(order.id as string)
    setMethod(null)
    setCashReceived('')
    setCartDishes(new Map())
    setCartProducts(new Map())
  }

  function incrementDish(id: string): void {
    setCartDishes((prev) => new Map(prev).set(id, (prev.get(id) ?? 0) + 1))
  }

  function decrementDish(id: string): void {
    setCartDishes((prev) => {
      const next = new Map(prev)
      const c = next.get(id) ?? 0
      if (c <= 1) next.delete(id)
      else next.set(id, c - 1)
      return next
    })
  }

  function incrementProduct(id: string): void {
    setCartProducts((prev) => new Map(prev).set(id, (prev.get(id) ?? 0) + 1))
  }

  function decrementProduct(id: string): void {
    setCartProducts((prev) => {
      const next = new Map(prev)
      const c = next.get(id) ?? 0
      if (c <= 1) next.delete(id)
      else next.set(id, c - 1)
      return next
    })
  }

  async function handleOpenDrawer(): Promise<void> {
    if (!openingEmployeeId) {
      toast.error('Selecciona un empleado')
      return
    }
    const balance = parseFloat(openingBalance)
    if (isNaN(balance) || balance < 0) {
      toast.error('Introduce un saldo inicial válido')
      return
    }
    try {
      await createDrawerMutate({
        employee: { id: openingEmployeeId },
        openingBalance: balance,
        openedAt: new Date().toISOString(),
        closingBalance: 0,
        expectedBalance: 0
      })
      setOpeningBalance('')
      toast.success('Caja abierta correctamente')
    } catch {
      toast.error('Error al abrir la caja')
    }
  }

  async function handleCharge(): Promise<void> {
    if (!selectedOrder || !method) return
    try {
      await createPaymentMutate({
        order: { id: selectedOrder.id as string },
        method,
        amount: totalAmount
      })
      await updateOrderMutate({
        id: selectedOrder.id as string,
        payload: { status: OrderStatusEnum.Paid }
      })
      toast.success('Cobro realizado correctamente')
      resetPaymentForm()
    } catch {
      toast.error('Error al procesar el cobro')
    }
  }

  async function handleCloseDrawer(): Promise<void> {
    if (!activeCashDrawer) return
    const balance = parseFloat(closingBalance)
    if (isNaN(balance) || balance < 0) {
      toast.error('Introduce un recuento físico válido')
      return
    }
    const drawerPayments = (payments ?? []).filter((p) => {
      if (!p.createdAt || !activeCashDrawer.openedAt) return false
      return new Date(p.createdAt) >= new Date(activeCashDrawer.openedAt)
    })
    const cashTotal = drawerPayments
      .filter((p) => p.method === PaymentMethodEnum.Cash)
      .reduce((s, p) => s + (p.amount ?? 0), 0)
    const expectedBalance = (activeCashDrawer.openingBalance ?? 0) + cashTotal
    try {
      await updateDrawerMutate({
        id: activeCashDrawer.id as string,
        payload: {
          closedAt: new Date().toISOString(),
          closingBalance: balance,
          expectedBalance
        }
      })
      setClosingBalance('')
      toast.success('Caja cerrada correctamente')
    } catch {
      toast.error('Error al cerrar la caja')
    }
  }

  const isLoading = ordersLoading || dishesLoading || productsLoading || employeesLoading || drawersLoading

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header: cash drawer status */}
      <div className="flex items-center gap-3 px-4 py-2 border-b bg-background shrink-0">
        <Receipt size={16} className="text-muted-foreground" />
        {activeCashDrawer ? (
          <>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              Caja abierta
            </Badge>
            <span className="text-sm text-muted-foreground">
              {activeCashDrawer.employee?.fullName ?? '—'} · desde{' '}
              {activeCashDrawer.openedAt
                ? new Date(activeCashDrawer.openedAt).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '—'}{' '}
              · Saldo inicial: {fmt(activeCashDrawer.openingBalance ?? 0)}
            </span>
          </>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            Sin caja abierta
          </Badge>
        )}
      </div>

      {/* Open drawer section if no active drawer */}
      {!activeCashDrawer && (
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote size={20} />
                Abrir caja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Empleado</Label>
                <Select
                  value={openingEmployeeId}
                  onValueChange={(v) => {
                    setOpeningEmployeeId(v)
                    localStorage.setItem('lastEmployeeId', v)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {allEmployees.map((e) => (
                      <SelectItem key={e.id as string} value={e.id as string}>
                        {e.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Saldo inicial (€)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleOpenDrawer}
                disabled={openingDrawer}
              >
                {openingDrawer ? 'Abriendo...' : 'Abrir caja'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main TPV area (only when drawer is open) */}
      {activeCashDrawer && (
        <Tabs defaultValue="cobros" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-4 mt-2 w-fit shrink-0">
            <TabsTrigger value="cobros">Cobros</TabsTrigger>
            <TabsTrigger value="arqueo">Arqueo / Cierre</TabsTrigger>
          </TabsList>

          {/* ─── TAB COBROS ─────────────────────────────────────────────── */}
          <TabsContent value="cobros" className="flex-1 overflow-hidden m-0 p-0">
            <div className="flex gap-0 h-full overflow-hidden">
              {/* Left: order list */}
              <div className="w-64 border-r flex flex-col overflow-hidden shrink-0">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b bg-muted/40">
                  Pedidos ({pendingOrders.length})
                </div>
                <div className="flex-1 overflow-y-auto">
                  {pendingOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center p-6">
                      No hay pedidos pendientes
                    </p>
                  ) : (
                    pendingOrders.map((order) => {
                      const tableNum =
                        (order.tableOccupation as { table?: { tableNumber?: number } })?.table
                          ?.tableNumber
                      const total = orderBaseTotal(order)
                      const isSelected = order.id === selectedOrderId
                      return (
                        <button
                          key={order.id as string}
                          onClick={() => selectOrder(order)}
                          className={`w-full text-left px-3 py-3 border-b hover:bg-muted/50 transition-colors ${
                            isSelected ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm">
                              Mesa {tableNum ?? '—'}
                            </span>
                            <span className="text-sm font-semibold">{fmt(total)}</span>
                          </div>
                          <div className="mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${STATUS_COLORS[order.status as OrderStatusEnum] ?? ''}`}
                            >
                              {STATUS_LABELS[order.status as OrderStatusEnum] ?? order.status}
                            </Badge>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Right: order detail + catalog + payment */}
              <div className="flex-1 overflow-hidden">
                {!selectedOrder ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                    <Receipt size={40} className="opacity-30" />
                    <p className="text-sm">Selecciona un pedido para cobrar</p>
                  </div>
                ) : (
                  <div className="flex h-full overflow-hidden">
                    {/* Left: catalog (component 2) */}
                    <div className="flex-1 overflow-y-auto p-4 border-r">
                      <Card>
                        <CardHeader className="pb-2 pt-3 px-4">
                          <CardTitle className="text-sm font-medium">Añadir del catálogo</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3">
                          <Tabs defaultValue="platos">
                            <TabsList className="mb-3">
                              <TabsTrigger value="platos" className="text-xs gap-1">
                                <Utensils size={12} /> Platos
                              </TabsTrigger>
                              <TabsTrigger value="consumibles" className="text-xs gap-1">
                                <Package size={12} /> Consumibles
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="platos" className="m-0">
                              <div className="grid grid-cols-2 gap-2">
                                {allDishes
                                  .filter((d) => d.isAvailable)
                                  .map((dish) => (
                                    <CatalogItem
                                      key={dish.id as string}
                                      name={dish.name ?? ''}
                                      subtitle={fmt(dish.price ?? 0)}
                                      count={cartDishes.get(dish.id as string) ?? 0}
                                      onIncrement={() => incrementDish(dish.id as string)}
                                      onDecrement={() => decrementDish(dish.id as string)}
                                    />
                                  ))}
                              </div>
                            </TabsContent>
                            <TabsContent value="consumibles" className="m-0">
                              <div className="grid grid-cols-2 gap-2">
                                {allProducts
                                  .filter((p) => p.isActive)
                                  .map((prod) => (
                                    <CatalogItem
                                      key={prod.id as string}
                                      name={prod.name ?? ''}
                                      subtitle={prod.category?.name ?? '—'}
                                      count={cartProducts.get(prod.id as string) ?? 0}
                                      onIncrement={() => incrementProduct(prod.id as string)}
                                      onDecrement={() => decrementProduct(prod.id as string)}
                                    />
                                  ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right: order header + cuenta + payment (components 1 and 3) */}
                    <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto p-4">
                      {/* Order header */}
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-base">
                          Mesa{' '}
                          {(selectedOrder.tableOccupation as { table?: { tableNumber?: number } })
                            ?.table?.tableNumber ?? '—'}
                          {' — '}
                          {selectedOrder.employee?.fullName ?? '—'}
                        </h2>
                        <button
                          onClick={() => setSelectedOrderId(null)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Cuenta card (component 1) */}
                      <Card>
                        <CardHeader className="pb-2 pt-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center gap-1">
                            <Utensils size={14} />
                            Cuenta
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3 space-y-1">
                          {Array.from(selectedOrder.orderDishes ?? []).map((od) => (
                            <div
                              key={od.id as string}
                              className="flex justify-between text-sm py-0.5"
                            >
                              <span>
                                {od.count}× {od.dish?.name ?? '—'}
                              </span>
                              <span className="font-medium">{fmt(od.total ?? 0)}</span>
                            </div>
                          ))}
                          {Array.from(selectedOrder.orderConsumableItems ?? []).map((oc) => (
                            <div
                              key={oc.id as string}
                              className="flex justify-between text-sm py-0.5"
                            >
                              <span>
                                {oc.count}× {oc.product?.name ?? '—'}
                              </span>
                              <span className="text-muted-foreground text-xs">(consumible)</span>
                            </div>
                          ))}
                          {(selectedOrder.tip ?? 0) > 0 && (
                            <div className="flex justify-between text-sm py-0.5 text-muted-foreground">
                              <span>Propina</span>
                              <span>{fmt(selectedOrder.tip ?? 0)}</span>
                            </div>
                          )}
                          {[...cartDishes.entries()].map(([id, count]) => {
                            const dish = allDishes.find((d) => d.id === id)
                            if (!dish) return null
                            return (
                              <div
                                key={`add-d-${id}`}
                                className="flex justify-between text-sm py-0.5 text-blue-600"
                              >
                                <span className="flex items-center gap-1">
                                  <Plus size={12} />
                                  {count}× {dish.name}
                                </span>
                                <span>{fmt((dish.price ?? 0) * count)}</span>
                              </div>
                            )
                          })}
                          {[...cartProducts.entries()].map(([id, count]) => {
                            const prod = allProducts.find((p) => p.id === id)
                            if (!prod) return null
                            return (
                              <div
                                key={`add-p-${id}`}
                                className="flex justify-between text-sm py-0.5 text-blue-600"
                              >
                                <span className="flex items-center gap-1">
                                  <Plus size={12} />
                                  {count}× {prod.name}
                                </span>
                                <span className="text-xs text-muted-foreground">(consumible)</span>
                              </div>
                            )
                          })}
                          <Separator className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{fmt(totalAmount)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment form (component 3) */}
                      <Card>
                        <CardHeader className="pb-2 pt-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center gap-1">
                            <CreditCard size={14} />
                            Método de pago
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {(
                              [
                                PaymentMethodEnum.Cash,
                                PaymentMethodEnum.CreditCard,
                                PaymentMethodEnum.DebitCard,
                                PaymentMethodEnum.Online,
                                PaymentMethodEnum.Transfer
                              ] as PaymentMethodEnum[]
                            ).map((m) => (
                              <Button
                                key={m}
                                variant={method === m ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  setMethod(m)
                                  setCashReceived('')
                                }}
                              >
                                {m === PaymentMethodEnum.Cash && <Banknote size={14} className="mr-1" />}
                                {(m === PaymentMethodEnum.CreditCard ||
                                  m === PaymentMethodEnum.DebitCard) && (
                                  <CreditCard size={14} className="mr-1" />
                                )}
                                {PAYMENT_METHOD_LABELS[m]}
                              </Button>
                            ))}
                          </div>

                          {method === PaymentMethodEnum.Cash && (
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Importe recibido (€)</Label>
                                <Input
                                  type="number"
                                  min={totalAmount}
                                  step="0.01"
                                  placeholder={fmt(totalAmount)}
                                  value={cashReceived}
                                  onChange={(e) => setCashReceived(e.target.value)}
                                  className="w-40"
                                />
                              </div>
                              {received > 0 && (
                                <div
                                  className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                >
                                  Cambio: {fmt(change)}
                                </div>
                              )}
                            </div>
                          )}

                          <Button
                            className="w-full"
                            size="lg"
                            disabled={!canCharge || paying || updatingOrder}
                            onClick={handleCharge}
                          >
                            <CheckCircle size={16} className="mr-2" />
                            {paying || updatingOrder ? 'Procesando...' : `Cobrar ${fmt(totalAmount)}`}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ─── TAB ARQUEO ─────────────────────────────────────────────── */}
          <TabsContent value="arqueo" className="flex-1 overflow-y-auto m-0 p-4">
            <ArqueoView
              cashDrawer={activeCashDrawer}
              payments={payments ?? []}
              closingBalance={closingBalance}
              onClosingBalanceChange={setClosingBalance}
              onClose={handleCloseDrawer}
              isClosing={closingDrawer}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CatalogItemProps {
  name: string
  subtitle: string
  count: number
  onIncrement: () => void
  onDecrement: () => void
}

function CatalogItem({
  name,
  subtitle,
  count,
  onIncrement,
  onDecrement
}: CatalogItemProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2 border rounded-md px-2 py-2">
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {count > 0 && (
          <>
            <button
              onClick={onDecrement}
              className="rounded p-0.5 hover:bg-muted transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="text-xs font-semibold w-4 text-center">{count}</span>
          </>
        )}
        <button
          onClick={onIncrement}
          className="rounded p-0.5 hover:bg-muted transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}

interface ArqueoViewProps {
  cashDrawer: import('@api/api').CashDrawer
  payments: import('@api/api').Payment[]
  closingBalance: string
  onClosingBalanceChange: (v: string) => void
  onClose: () => void
  isClosing: boolean
}

function ArqueoView({
  cashDrawer,
  payments,
  closingBalance,
  onClosingBalanceChange,
  onClose,
  isClosing
}: ArqueoViewProps): JSX.Element {
  const drawerPayments = payments.filter((p) => {
    if (!p.createdAt || !cashDrawer.openedAt) return false
    return new Date(p.createdAt) >= new Date(cashDrawer.openedAt)
  })

  const byMethod = drawerPayments.reduce<Record<string, number>>((acc, p) => {
    const m = p.method ?? 'UNKNOWN'
    acc[m] = (acc[m] ?? 0) + (p.amount ?? 0)
    return acc
  }, {})

  const totalCharged = drawerPayments.reduce((s, p) => s + (p.amount ?? 0), 0)
  const cashTotal = byMethod[PaymentMethodEnum.Cash] ?? 0
  const expectedBalance = (cashDrawer.openingBalance ?? 0) + cashTotal
  const closing = parseFloat(closingBalance) || 0
  const difference = closingBalance !== '' ? closing - expectedBalance : null

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <Card>
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-medium">Resumen de cobros de la sesión</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          {Object.entries(byMethod).map(([m, total]) => (
            <div key={m} className="flex justify-between text-sm">
              <span>{PAYMENT_METHOD_LABELS[m as PaymentMethodEnum] ?? m}</span>
              <span className="font-medium">{fmt(total)}</span>
            </div>
          ))}
          {Object.keys(byMethod).length === 0 && (
            <p className="text-sm text-muted-foreground">Sin cobros en esta sesión</p>
          )}
          <Separator className="my-1" />
          <div className="flex justify-between font-semibold">
            <span>Total cobrado</span>
            <span>{fmt(totalCharged)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            <Banknote size={14} />
            Cierre de caja
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Saldo inicial</span>
            <span>{fmt(cashDrawer.openingBalance ?? 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cobros en efectivo</span>
            <span>{fmt(cashTotal)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Efectivo esperado</span>
            <span>{fmt(expectedBalance)}</span>
          </div>
          <Separator />
          <div className="space-y-1">
            <Label className="text-xs">Recuento físico (€)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={closingBalance}
              onChange={(e) => onClosingBalanceChange(e.target.value)}
              className="w-40"
            />
          </div>
          {difference !== null && (
            <div
              className={`text-sm font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              Diferencia: {difference >= 0 ? '+' : ''}
              {fmt(difference)}
              {difference > 0 && ' (sobrante)'}
              {difference < 0 && ' (faltante)'}
            </div>
          )}
          <Button
            variant="destructive"
            className="w-full"
            disabled={isClosing || closingBalance === ''}
            onClick={onClose}
          >
            {isClosing ? 'Cerrando...' : 'Cerrar caja'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default TPV
