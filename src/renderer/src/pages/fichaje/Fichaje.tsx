import { JSX, useState, useMemo } from 'react'
import { Plus, Shield, List, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useWorkLogs } from './hooks/useFichaje'
import { useEmployees } from '@renderer/pages/masters/hooks/useMasters'
import WorkLogCard from './components/WorkLogCard'
import CreateWorkLogDialog from './components/CreateWorkLogDialog'
import VacationCalendar from './components/VacationCalendar'
import { WORK_LOG_TYPE_LABELS, WorkLogTypeEnum } from './types/fichajeTypes'
import type { WorkLogType } from './types/fichajeTypes'

type View = 'logs' | 'vacations'

const ALL_EMPLOYEES = '__all__'
const ALL_TYPES = '__all__'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function Fichaje(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [view, setView] = useState<View>('logs')
  const [filterEmployee, setFilterEmployee] = useState<string>(ALL_EMPLOYEES)
  const [filterType, setFilterType] = useState<string>(ALL_TYPES)
  const [filterFrom, setFilterFrom] = useState<string>(todayISO())
  const [filterTo, setFilterTo] = useState<string>(todayISO())

  const { data: logs, isLoading, isError } = useWorkLogs()
  const { data: employees } = useEmployees()

  const filtered = useMemo(() => {
    if (!logs) return []
    return logs
      .filter((log) => {
        if (filterEmployee !== ALL_EMPLOYEES && log.employee.id !== filterEmployee) return false
        if (filterType !== ALL_TYPES && log.type !== filterType) return false
        if (filterFrom) {
          const logDate = log.timestamp.slice(0, 10)
          if (logDate < filterFrom) return false
        }
        if (filterTo) {
          const logDate = log.timestamp.slice(0, 10)
          if (logDate > filterTo) return false
        }
        return true
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [logs, filterEmployee, filterType, filterFrom, filterTo])

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Fichaje</h1>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield size={12} />
            <span>Registro de jornada laboral — RDL 8/2019. Los registros son inmutables.</span>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Registrar fichaje
        </Button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        <Button
          variant={view === 'logs' ? 'default' : 'ghost'}
          size="sm"
          className="flex items-center gap-2 h-8"
          onClick={() => setView('logs')}
        >
          <List size={14} />
          Registros
        </Button>
        <Button
          variant={view === 'vacations' ? 'default' : 'ghost'}
          size="sm"
          className="flex items-center gap-2 h-8"
          onClick={() => setView('vacations')}
        >
          <CalendarDays size={14} />
          Vacaciones
        </Button>
      </div>

      {view === 'vacations' && <VacationCalendar />}

      {view === 'logs' && (
        <>
        <div className="flex flex-wrap items-end gap-4 p-4 border border-border rounded-lg bg-muted/30">
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <Label>Empleado</Label>
          <Select value={filterEmployee} onValueChange={setFilterEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_EMPLOYEES}>Todos los empleados</SelectItem>
              {(employees ?? []).map((e) => (
                <SelectItem key={e.id} value={e.id ?? ''}>
                  {e.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <Label>Tipo</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TYPES}>Todos los tipos</SelectItem>
              {Object.entries(WorkLogTypeEnum).map(([, value]) => (
                <SelectItem key={value} value={value}>
                  {WORK_LOG_TYPE_LABELS[value as WorkLogType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Desde</Label>
          <Input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="w-[150px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Hasta</Label>
          <Input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="w-[150px]"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setFilterEmployee(ALL_EMPLOYEES)
            setFilterType(ALL_TYPES)
            setFilterFrom(todayISO())
            setFilterTo(todayISO())
          }}
        >
          Limpiar filtros
        </Button>
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-12">
            Cargando registros...
          </p>
        )}

        {isError && (
          <p className="text-sm text-destructive text-center py-12">
            Error al cargar los registros de fichaje.
          </p>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
            <Shield size={40} className="opacity-30" />
            <p className="text-sm">No hay registros para los filtros seleccionados.</p>
          </div>
        )}

        {filtered.map((log) => (
          <WorkLogCard key={log.id} log={log} />
        ))}
      </div>
        </>
      )}

      <CreateWorkLogDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

export default Fichaje
