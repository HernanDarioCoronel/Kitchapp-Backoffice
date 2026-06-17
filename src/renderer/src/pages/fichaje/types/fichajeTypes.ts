import type { Employee } from '@api/api'

export const WorkLogTypeEnum = {
  ClockIn: 'CLOCK_IN',
  ClockOut: 'CLOCK_OUT',
  BreakStart: 'BREAK_START',
  BreakEnd: 'BREAK_END',
  VacationStart: 'VACATION_START',
  VacationEnd: 'VACATION_END'
} as const

export type WorkLogType = (typeof WorkLogTypeEnum)[keyof typeof WorkLogTypeEnum]

export interface WorkLog {
  id: string
  employee: Employee
  type: WorkLogType
  timestamp: string
  notes?: string
  createdAt: string
}

export interface CreateWorkLogPayload {
  employeeId: string
  type: WorkLogType
  timestamp: string
  notes?: string
}

export interface WorkLogsFilters {
  employeeId?: string
  from?: string
  to?: string
  type?: WorkLogType
}

export const WORK_LOG_TYPE_LABELS: Record<WorkLogType, string> = {
  CLOCK_IN: 'Entrada',
  CLOCK_OUT: 'Salida',
  BREAK_START: 'Inicio descanso',
  BREAK_END: 'Fin descanso',
  VACATION_START: 'Inicio vacaciones',
  VACATION_END: 'Fin vacaciones'
}

export const WORK_LOG_TYPE_COLORS: Record<WorkLogType, string> = {
  CLOCK_IN: 'bg-green-100 text-green-800 border-green-200',
  CLOCK_OUT: 'bg-red-100 text-red-800 border-red-200',
  BREAK_START: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  BREAK_END: 'bg-orange-100 text-orange-800 border-orange-200',
  VACATION_START: 'bg-blue-100 text-blue-800 border-blue-200',
  VACATION_END: 'bg-indigo-100 text-indigo-800 border-indigo-200'
}
