import { JSX } from 'react'
import { Clock, User, FileText } from 'lucide-react'
import type { WorkLog } from '../types/fichajeTypes'
import { WORK_LOG_TYPE_LABELS, WORK_LOG_TYPE_COLORS } from '../types/fichajeTypes'

interface WorkLogCardProps {
  log: WorkLog
}

function formatDateTime(isoString: string): { date: string; time: string } {
  const d = new Date(isoString)
  return {
    date: d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }
}

function WorkLogCard({ log }: WorkLogCardProps): JSX.Element {
  const { date, time } = formatDateTime(log.timestamp)
  const colorClass = WORK_LOG_TYPE_COLORS[log.type]
  const label = WORK_LOG_TYPE_LABELS[log.type]

  return (
    <div className="flex items-center gap-4 px-4 py-3 border border-border rounded-lg bg-card hover:bg-accent/30 transition-colors">
      <div className="flex flex-col items-center justify-center min-w-[72px] text-center">
        <span className="text-sm font-semibold text-foreground">{time}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex items-center gap-2 min-w-[160px]">
        <User size={14} className="text-muted-foreground shrink-0" />
        <span className="text-sm font-medium text-foreground truncate">
          {log.employee.fullName ?? '—'}
        </span>
      </div>

      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
      >
        {label}
      </span>

      {log.notes && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
          <FileText size={13} className="shrink-0" />
          <span className="truncate max-w-[220px]">{log.notes}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <Clock size={12} />
        <span>
          Registrado{' '}
          {new Date(log.createdAt).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  )
}

export default WorkLogCard
