import { JSX, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useEmployees } from '@renderer/pages/masters/hooks/useMasters'
import { useWorkLogs, useCreateWorkLog } from '../hooks/useFichaje'
import { WorkLogTypeEnum } from '../types/fichajeTypes'
import type { WorkLog, WorkLogType } from '../types/fichajeTypes'

type EmployeeStatus = 'OUT' | 'IN' | 'ON_BREAK' | 'ON_VACATION'

function getEmployeeStatus(logs: WorkLog[]): EmployeeStatus {
  if (!logs.length) return 'OUT'
  const sorted = [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  switch (sorted[0].type) {
    case WorkLogTypeEnum.ClockIn:
    case WorkLogTypeEnum.BreakEnd:
      return 'IN'
    case WorkLogTypeEnum.BreakStart:
      return 'ON_BREAK'
    case WorkLogTypeEnum.VacationStart:
      return 'ON_VACATION'
    default:
      return 'OUT'
  }
}

const STATUS_LABEL: Record<EmployeeStatus, string> = {
  OUT: 'Fuera de la empresa',
  IN: 'En la empresa',
  ON_BREAK: 'En descanso',
  ON_VACATION: 'De vacaciones'
}

const STATUS_COLOR: Record<EmployeeStatus, string> = {
  OUT: 'bg-gray-100 text-gray-700 border-gray-300',
  IN: 'bg-green-100 text-green-700 border-green-300',
  ON_BREAK: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  ON_VACATION: 'bg-blue-100 text-blue-700 border-blue-300'
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface CreateWorkLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CreateWorkLogDialog({ open, onOpenChange }: CreateWorkLogDialogProps): JSX.Element {
  const { data: employees } = useEmployees()
  const { mutateAsync, isPending } = useCreateWorkLog()

  const [employeeId, setEmployeeId] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [showVacation, setShowVacation] = useState<boolean>(false)
  const [vacationFrom, setVacationFrom] = useState<string>('')
  const [vacationTo, setVacationTo] = useState<string>('')
  const [now, setNow] = useState<Date>(() => new Date())

  const { data: employeeLogs, isLoading: logsLoading } = useWorkLogs({ employeeId }, !!employeeId)

  const status = useMemo<EmployeeStatus | null>(() => {
    if (!employeeId || !employeeLogs) return null
    return getEmployeeStatus(employeeLogs)
  }, [employeeId, employeeLogs])

  // Refresh displayed time every 30 s while dialog is open
  useEffect(() => {
    if (!open) return
    const interval = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(interval)
  }, [open])

  function resetForm(): void {
    setEmployeeId('')
    setNotes('')
    setShowVacation(false)
    setVacationFrom('')
    setVacationTo('')
  }

  function handleClose(): void {
    resetForm()
    onOpenChange(false)
  }

  async function registerAction(type: WorkLogType): Promise<void> {
    try {
      await mutateAsync({
        employeeId,
        type,
        timestamp: new Date().toISOString(),
        notes: notes.trim() || undefined
      })
      toast.success('Fichaje registrado correctamente')
      handleClose()
    } catch {
      toast.error('Error al registrar el fichaje')
    }
  }

  async function registerVacation(): Promise<void> {
    if (!vacationFrom || !vacationTo) {
      toast.error('Selecciona las fechas de inicio y fin de vacaciones')
      return
    }
    if (vacationFrom > vacationTo) {
      toast.error('La fecha de fin debe ser igual o posterior al inicio')
      return
    }
    try {
      await mutateAsync({
        employeeId,
        type: WorkLogTypeEnum.VacationStart,
        timestamp: new Date(vacationFrom + 'T00:00:00').toISOString(),
        notes: notes.trim() || undefined
      })
      await mutateAsync({
        employeeId,
        type: WorkLogTypeEnum.VacationEnd,
        timestamp: new Date(vacationTo + 'T23:59:59').toISOString(),
        notes: notes.trim() || undefined
      })
      toast.success('Vacaciones registradas correctamente')
      handleClose()
    } catch {
      toast.error('Error al registrar las vacaciones')
    }
  }

  const showActions = employeeId && !logsLoading && status !== null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Registrar fichaje</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Employee selector */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="employee">Empleado</Label>
            <Select
              value={employeeId}
              onValueChange={(v) => {
                setEmployeeId(v)
                setShowVacation(false)
              }}
            >
              <SelectTrigger id="employee">
                <SelectValue placeholder="Selecciona un empleado" />
              </SelectTrigger>
              <SelectContent>
                {(employees ?? [])
                  .filter((e) => e.isActive)
                  .map((e) => (
                    <SelectItem key={e.id} value={e.id ?? ''}>
                      {e.fullName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status + system time */}
          {employeeId && (
            <div className="rounded-md border bg-muted/40 divide-y divide-border">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">Estado</span>
                {logsLoading ? (
                  <span className="text-xs text-muted-foreground">Cargando...</span>
                ) : status ? (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLOR[status]}`}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">Hora del sistema</span>
                <span className="text-sm font-medium tabular-nums">{formatDateTime(now)}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          {showActions && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Observaciones (opcional)</Label>
              <Input
                id="notes"
                placeholder="Ej: Teletrabajo, baja médica..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          )}

          {/* Vacation date range */}
          {showActions && showVacation && (
            <div className="flex flex-col gap-3 rounded-md border border-blue-200 bg-blue-50/50 p-3">
              <p className="text-sm font-medium text-blue-800">Periodo de vacaciones</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="vacationFrom" className="text-xs">
                    Desde
                  </Label>
                  <Input
                    id="vacationFrom"
                    type="date"
                    value={vacationFrom}
                    onChange={(e) => setVacationFrom(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="vacationTo" className="text-xs">
                    Hasta
                  </Label>
                  <Input
                    id="vacationTo"
                    type="date"
                    value={vacationTo}
                    onChange={(e) => setVacationTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {showActions && (
            <div className="flex flex-col gap-2">
              {!showVacation ? (
                <>
                  {status === 'OUT' && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => registerAction(WorkLogTypeEnum.ClockIn)}
                      disabled={isPending}
                    >
                      Registrar entrada
                    </Button>
                  )}

                  {(status === 'IN' || status === 'ON_BREAK') && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => registerAction(WorkLogTypeEnum.ClockOut)}
                      disabled={isPending}
                    >
                      Registrar salida
                    </Button>
                  )}

                  {status === 'IN' && (
                    <Button
                      variant="outline"
                      className="w-full border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                      onClick={() => registerAction(WorkLogTypeEnum.BreakStart)}
                      disabled={isPending}
                    >
                      Inicio descanso
                    </Button>
                  )}

                  {status === 'ON_BREAK' && (
                    <Button
                      variant="outline"
                      className="w-full border-orange-400 text-orange-700 hover:bg-orange-50"
                      onClick={() => registerAction(WorkLogTypeEnum.BreakEnd)}
                      disabled={isPending}
                    >
                      Fin descanso
                    </Button>
                  )}

                  {status === 'ON_VACATION' && (
                    <Button
                      variant="outline"
                      className="w-full border-blue-400 text-blue-700 hover:bg-blue-50"
                      onClick={() => registerAction(WorkLogTypeEnum.VacationEnd)}
                      disabled={isPending}
                    >
                      Fin vacaciones
                    </Button>
                  )}

                  {status !== 'ON_VACATION' && (
                    <>
                      <div className="relative my-0.5">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-background px-2 text-xs text-muted-foreground">
                            o
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => setShowVacation(true)}
                        disabled={isPending}
                      >
                        Registrar vacaciones
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowVacation(false)}
                    disabled={isPending}
                  >
                    Volver
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={registerVacation}
                    disabled={isPending}
                  >
                    {isPending ? 'Guardando...' : 'Confirmar vacaciones'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkLogDialog
