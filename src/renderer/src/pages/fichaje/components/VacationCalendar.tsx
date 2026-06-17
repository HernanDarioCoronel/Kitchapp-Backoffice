import { JSX, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWorkLogs } from '../hooks/useFichaje'
import { WorkLogTypeEnum } from '../types/fichajeTypes'
import type { WorkLog } from '../types/fichajeTypes'

const PALETTE = [
  'bg-blue-200 text-blue-900',
  'bg-emerald-200 text-emerald-900',
  'bg-purple-200 text-purple-900',
  'bg-orange-200 text-orange-900',
  'bg-pink-200 text-pink-900',
  'bg-teal-200 text-teal-900',
  'bg-yellow-200 text-yellow-900',
  'bg-red-200 text-red-900'
]

interface VacationPeriod {
  employeeId: string
  employeeName: string
  startDate: Date
  endDate: Date
  colorIndex: number
}

function buildVacationPeriods(logs: WorkLog[]): VacationPeriod[] {
  const colorMap = new Map<string, number>()
  let nextColor = 0

  const vacLogs = [...logs]
    .filter((l) => l.type === WorkLogTypeEnum.VacationStart || l.type === WorkLogTypeEnum.VacationEnd)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const byEmployee: Record<string, WorkLog[]> = {}
  for (const log of vacLogs) {
    const id = log.employee.id ?? ''
    if (!byEmployee[id]) {
      byEmployee[id] = []
      if (!colorMap.has(id)) colorMap.set(id, nextColor++ % PALETTE.length)
    }
    byEmployee[id].push(log)
  }

  const periods: VacationPeriod[] = []

  for (const [empId, empLogs] of Object.entries(byEmployee)) {
    let i = 0
    while (i < empLogs.length) {
      if (empLogs[i].type === WorkLogTypeEnum.VacationStart) {
        const startLog = empLogs[i]
        const endLog = empLogs.slice(i + 1).find((l) => l.type === WorkLogTypeEnum.VacationEnd)
        periods.push({
          employeeId: empId,
          employeeName: startLog.employee.fullName ?? empId,
          startDate: new Date(startLog.timestamp),
          endDate: endLog ? new Date(endLog.timestamp) : new Date('9999-12-31'),
          colorIndex: colorMap.get(empId) ?? 0
        })
        i = endLog ? empLogs.indexOf(endLog) + 1 : i + 1
      } else {
        i++
      }
    }
  }

  return periods
}

function dayStart(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

function isInPeriod(day: Date, period: VacationPeriod): boolean {
  const d = dayStart(day)
  return d >= dayStart(period.startDate) && d <= dayStart(period.endDate)
}

function isSameDay(a: Date, b: Date): boolean {
  return dayStart(a) === dayStart(b)
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function VacationCalendar(): JSX.Element {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const { data: logs, isLoading } = useWorkLogs()

  const periods = useMemo(() => buildVacationPeriods(logs ?? []), [logs])

  const cells = useMemo<(Date | null)[]>(() => {
    const firstDay = new Date(year, month, 1)
    // Monday-based offset (0 = Mon, 6 = Sun)
    let offset = firstDay.getDay() - 1
    if (offset < 0) offset = 6
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const result: (Date | null)[] = Array(offset).fill(null)
    for (let d = 1; d <= daysInMonth; d++) result.push(new Date(year, month, d))
    while (result.length % 7 !== 0) result.push(null)
    return result
  }, [year, month])

  function prev(): void {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }

  function next(): void {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  // Unique employees that appear in any period — for the legend
  const legend = useMemo(() => {
    const seen = new Map<string, { name: string; colorIndex: number }>()
    for (const p of periods) {
      if (!seen.has(p.employeeId)) seen.set(p.employeeId, { name: p.employeeName, colorIndex: p.colorIndex })
    }
    return [...seen.entries()]
  }, [periods])

  // Periods active this month (for the empty-state check)
  const periodsThisMonth = useMemo(() => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    return periods.filter(
      (p) => dayStart(p.startDate) <= dayStart(monthEnd) && dayStart(p.endDate) >= dayStart(monthStart)
    )
  }, [periods, year, month])

  return (
    <div className="flex flex-col gap-4">
      {/* Month navigation */}
      <div className="flex items-center gap-3 justify-between">
        <Button variant="outline" size="sm" onClick={prev}>
          <ChevronLeft size={16} />
        </Button>
        <span className="font-semibold text-base min-w-[160px] text-center">
          {MONTHS[month]} {year}
        </span>
        <Button variant="outline" size="sm" onClick={next}>
          <ChevronRight size={16} />
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Cargando...</p>
      ) : (
        <>
          {/* Day headers */}
          <div className="grid grid-cols-7">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {cells.map((day, i) => {
              if (!day) {
                return <div key={`e-${i}`} className="bg-muted/20 min-h-[72px]" />
              }
              const isToday = isSameDay(day, today)
              const onVacation = periods.filter((p) => isInPeriod(day, p))

              return (
                <div
                  key={day.getTime()}
                  className="bg-card min-h-32 p-1.5 flex flex-col gap-1"
                >
                  <span
                    className={`text-xs font-medium self-end h-5 w-5 flex items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {onVacation.map((p) => (
                    <span
                      key={p.employeeId}
                      title={p.employeeName}
                      className={`text-[10px] leading-tight font-medium px-1 py-0.5 rounded truncate ${PALETTE[p.colorIndex]}`}
                    >
                      {p.employeeName}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Empty state */}
          {periodsThisMonth.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No hay vacaciones registradas para este mes.
            </p>
          )}

          {/* Legend */}
          {legend.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {legend.map(([id, { name, colorIndex }]) => (
                <span
                  key={id}
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${PALETTE[colorIndex]}`}
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VacationCalendar
