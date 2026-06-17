import { JSX } from 'react'
import { ClipboardList, Euro, Store, Utensils, Users, UtensilsCrossed } from 'lucide-react'
import { OrderStatusEnum, PaymentMethodEnum, TableOccupationStatusEnum } from '@api/api'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Badge } from '@renderer/components/ui/badge'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { Separator } from '@renderer/components/ui/separator'
import { useOrders } from '@renderer/pages/orders/hooks/useOrders'
import { STATUS_LABELS, STATUS_COLORS } from '@renderer/pages/orders/orderTypes'
import {
  useTables,
  useTableOccupations,
  useEmployees
} from '@renderer/pages/masters/hooks/useMasters'
import { useDishes } from '@renderer/pages/dishes/hooks/useDishes'
import { usePayments, useCashDrawers } from '@renderer/pages/tpv/hooks/useTpv'
import { PAYMENT_METHOD_LABELS } from '@renderer/pages/tpv/types/tpvTypes'

const fmt = (n: number): string =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

function isToday(dateStr: string | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function Dashboard(): JSX.Element {
  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { data: tables, isLoading: tablesLoading } = useTables()
  const { data: occupations, isLoading: occupationsLoading } = useTableOccupations()
  const { data: employees, isLoading: employeesLoading } = useEmployees()
  const { data: dishes, isLoading: dishesLoading } = useDishes()
  const { data: payments, isLoading: paymentsLoading } = usePayments()
  const { data: cashDrawers, isLoading: drawersLoading } = useCashDrawers()

  const isLoading =
    ordersLoading ||
    tablesLoading ||
    occupationsLoading ||
    employeesLoading ||
    dishesLoading ||
    paymentsLoading ||
    drawersLoading

  // ── Derived values ──────────────────────────────────────────────────────────
  const activeOrders = (orders ?? []).filter((o) => o.status !== OrderStatusEnum.Paid)
  const activeTables = tables?.filter((t) => t.isActive) ?? []
  const activeOccupations = (occupations ?? []).filter(
    (o) =>
      o.status === TableOccupationStatusEnum.Open ||
      o.status === TableOccupationStatusEnum.Occupied
  )
  const availableDishes = (dishes ?? []).filter((d) => d.isAvailable)
  const activeEmployees = (employees ?? []).filter((e) => e.isActive)

  const todayPayments = (payments ?? []).filter((p) => isToday(p.createdAt))
  const totalToday = todayPayments.reduce((s, p) => s + (p.amount ?? 0), 0)

  const activeCashDrawer = (cashDrawers ?? []).find((d) => !d.closedAt)

  const ordersByStatus = Object.values(OrderStatusEnum).map((status) => ({
    status,
    count: (orders ?? []).filter((o) => o.status === status).length
  }))
  const totalOrders = (orders ?? []).length || 1

  const recentOrders = [...(orders ?? [])]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5)

  const paymentsByMethod = todayPayments.reduce<Record<string, number>>((acc, p) => {
    const m = p.method ?? 'UNKNOWN'
    acc[m] = (acc[m] ?? 0) + (p.amount ?? 0)
    return acc
  }, {})

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {/* ── Fila 1: KPIs operativos ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          title="Pedidos activos"
          value={isLoading ? undefined : activeOrders.length}
          icon={<ClipboardList size={18} className="text-muted-foreground" />}
          subtitle="no cobrados"
        />
        <KpiCard
          title="Mesas ocupadas"
          value={isLoading ? undefined : activeOccupations.length}
          icon={<UtensilsCrossed size={18} className="text-muted-foreground" />}
          subtitle={`de ${activeTables.length} activas`}
        />
        <KpiCard
          title="Platos disponibles"
          value={isLoading ? undefined : availableDishes.length}
          icon={<Utensils size={18} className="text-muted-foreground" />}
          subtitle="en carta"
        />
        <KpiCard
          title="Empleados activos"
          value={isLoading ? undefined : activeEmployees.length}
          icon={<Users size={18} className="text-muted-foreground" />}
          subtitle="en plantilla"
        />
      </div>

      {/* ── Fila 2: KPIs financieros ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Euro size={16} className="text-muted-foreground" />
              Total cobrado hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {paymentsLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <p className="text-2xl font-bold">{fmt(totalToday)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {todayPayments.length} cobro{todayPayments.length !== 1 ? 's' : ''} hoy
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Store size={16} className="text-muted-foreground" />
              Estado de caja
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {drawersLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : activeCashDrawer ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-300 text-xs"
                  >
                    Abierta
                  </Badge>
                  <span className="text-sm font-medium">
                    {activeCashDrawer.employee?.fullName ?? '—'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Desde{' '}
                  {activeCashDrawer.openedAt
                    ? new Date(activeCashDrawer.openedAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '—'}{' '}
                  · Saldo inicial: {fmt(activeCashDrawer.openingBalance ?? 0)}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-300 text-xs"
                >
                  Cerrada
                </Badge>
                <span className="text-xs text-muted-foreground">Sin caja abierta</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Fila 3: Estado de pedidos + Últimos pedidos ─────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium">Estado de pedidos</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-2">
            {ordersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : (
              ordersByStatus.map(({ status, count }) => (
                <div key={status} className="flex items-center gap-2">
                  <span className="text-xs w-28 text-muted-foreground shrink-0">
                    {STATUS_LABELS[status]}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${statusBarColor(status)}`}
                      style={{ width: `${Math.round((count / totalOrders) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-5 text-right shrink-0">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium">Últimos pedidos</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {ordersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin pedidos</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => {
                  const tableNum = (
                    order.tableOccupation as { table?: { tableNumber?: number } }
                  )?.table?.tableNumber
                  const time = order.createdAt
                    ? new Date(order.createdAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '—'
                  return (
                    <div key={order.id as string} className="flex items-center gap-2 text-xs">
                      <span className="w-14 shrink-0 font-medium">
                        Mesa {tableNum ?? '—'}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${STATUS_COLORS[order.status as OrderStatusEnum] ?? ''}`}
                      >
                        {STATUS_LABELS[order.status as OrderStatusEnum] ?? order.status}
                      </Badge>
                      <span className="text-muted-foreground truncate flex-1">
                        {order.employee?.fullName ?? '—'}
                      </span>
                      <span className="text-muted-foreground shrink-0">{time}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Fila 4: Mesas activas + Cobros por método ───────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium">Mesas activas</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {occupationsLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : activeOccupations.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin mesas activas</p>
            ) : (
              <div className="space-y-2">
                {activeOccupations.map((occ) => {
                  const tableNum = (occ.table as { tableNumber?: number })?.tableNumber
                  const startTime = occ.startedAt
                    ? new Date(occ.startedAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '—'
                  return (
                    <div key={occ.id as string} className="flex items-center gap-2 text-xs">
                      <span className="font-medium w-16 shrink-0">
                        Mesa {tableNum ?? '—'}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${occStatusColor(occ.status as TableOccupationStatusEnum)}`}
                      >
                        {occStatusLabel(occ.status as TableOccupationStatusEnum)}
                      </Badge>
                      <span className="text-muted-foreground">desde {startTime}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm font-medium">Cobros por método hoy</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            {paymentsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            ) : Object.keys(paymentsByMethod).length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin cobros hoy</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(paymentsByMethod).map(([method, total]) => (
                  <div key={method} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {PAYMENT_METHOD_LABELS[method as PaymentMethodEnum] ?? method}
                    </span>
                    <span className="font-semibold">{fmt(total)}</span>
                  </div>
                ))}
                <Separator className="my-1" />
                <div className="flex justify-between text-xs font-semibold">
                  <span>Total</span>
                  <span>{fmt(totalToday)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string
  value: number | undefined
  icon: JSX.Element
  subtitle: string
}

function KpiCard({ title, value, icon, subtitle }: KpiCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="px-4 pb-3">
        {value === undefined ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function statusBarColor(status: OrderStatusEnum): string {
  switch (status) {
    case OrderStatusEnum.Waiting:
      return 'bg-yellow-400'
    case OrderStatusEnum.InPreparation:
      return 'bg-blue-400'
    case OrderStatusEnum.Done:
      return 'bg-green-400'
    case OrderStatusEnum.Delivered:
      return 'bg-purple-400'
    case OrderStatusEnum.Paid:
      return 'bg-gray-300'
  }
}

function occStatusLabel(status: TableOccupationStatusEnum): string {
  switch (status) {
    case TableOccupationStatusEnum.Open:
      return 'Abierta'
    case TableOccupationStatusEnum.Occupied:
      return 'Ocupada'
    case TableOccupationStatusEnum.Unavaliable:
      return 'Reservada'
    case TableOccupationStatusEnum.Closed:
      return 'Cerrada'
  }
}

function occStatusColor(status: TableOccupationStatusEnum): string {
  switch (status) {
    case TableOccupationStatusEnum.Open:
      return 'bg-green-50 text-green-700 border-green-300'
    case TableOccupationStatusEnum.Occupied:
      return 'bg-orange-50 text-orange-700 border-orange-300'
    case TableOccupationStatusEnum.Unavaliable:
      return 'bg-red-50 text-red-700 border-red-300'
    case TableOccupationStatusEnum.Closed:
      return 'bg-gray-50 text-gray-700 border-gray-300'
  }
}

export default Dashboard
