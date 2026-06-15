import { JSX, useEffect, useMemo, useRef, useState } from 'react'
import { RestaurantTable, TableOccupation, TableOccupationStatusEnum } from '@api/api'
import { useTables, useTableOccupations, useLayers } from '@renderer/pages/masters/hooks/useMasters'
import { Minus, Plus } from 'lucide-react'

const TABLE_SIZE = 90
const GRID_SIZE = 40
const CANVAS_W = 1600
const CANVAS_H = 900

function getTableStyle(
  table: RestaurantTable,
  occ: TableOccupation | null
): { bg: string; text: string } {
  if (!table.isActive) return { bg: '#9ca3af', text: '#fff' }
  if (!occ || occ.status === TableOccupationStatusEnum.Closed)
    return { bg: '#22c55e', text: '#fff' }
  if (occ.status === TableOccupationStatusEnum.Unavaliable)
    return { bg: '#ef4444', text: '#fff' }
  return { bg: '#f97316', text: '#fff' }
}

function buildOccupationMap(occupations: TableOccupation[]): Map<string, TableOccupation> {
  const map = new Map<string, TableOccupation>()
  for (const occ of occupations) {
    if (occ.status !== TableOccupationStatusEnum.Closed && occ.table?.id) {
      map.set(occ.table.id as string, occ)
    }
  }
  return map
}

interface TableMapViewProps {
  onFreeTableClick: (table: RestaurantTable) => void
  onOccupiedTableClick: (table: RestaurantTable, occupation: TableOccupation) => void
  isCreatingOccupation?: boolean
}

// ─── Per-layer canvas with pan/zoom ──────────────────────────────────────────

interface LayerViewProps {
  tables: RestaurantTable[]
  occMap: Map<string, TableOccupation>
  onTableClick: (table: RestaurantTable) => void
  isCreatingOccupation: boolean
}

function LayerView({ tables, occMap, onTableClick, isCreatingOccupation }: LayerViewProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const panRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const [pan, setPanState] = useState({ x: 0, y: 0 })
  const [zoom, setZoomState] = useState(1)

  function applyPan(v: { x: number; y: number }): void { panRef.current = v; setPanState(v) }
  function applyZoom(v: number): void { zoomRef.current = v; setZoomState(v) }

  const isPanningRef = useRef(false)
  const [cursor, setCursor] = useState('default')
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 })

  // Auto-fit canvas on mount
  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const pad = 32
    const fitZoom = Math.min((rect.width - pad * 2) / CANVAS_W, (rect.height - pad * 2) / CANVAS_H, 1)
    const fitted = {
      x: (rect.width - CANVAS_W * fitZoom) / 2,
      y: (rect.height - CANVAS_H * fitZoom) / 2
    }
    panRef.current = fitted; zoomRef.current = fitZoom
    setPanState(fitted); setZoomState(fitZoom)
  }, [])

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current; if (!el) return
    function onWheel(e: WheelEvent): void {
      e.preventDefault()
      const rect = el!.getBoundingClientRect()
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      const newZoom = Math.max(0.2, Math.min(3, zoomRef.current * factor))
      applyZoom(newZoom)
      applyPan({
        x: cx - (cx - panRef.current.x) * (newZoom / zoomRef.current),
        y: cy - (cy - panRef.current.y) * (newZoom / zoomRef.current)
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Global pan events
  useEffect(() => {
    function onMouseMove(e: MouseEvent): void {
      if (!isPanningRef.current) return
      applyPan({
        x: dragStartRef.current.panX + (e.clientX - dragStartRef.current.mouseX),
        y: dragStartRef.current.panY + (e.clientY - dragStartRef.current.mouseY)
      })
    }
    function onMouseUp(): void {
      if (!isPanningRef.current) return
      isPanningRef.current = false; setCursor('default')
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  function onBgMouseDown(e: React.MouseEvent): void {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('[data-table-btn]')) return
    e.preventDefault(); isPanningRef.current = true; setCursor('grabbing')
    dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, panX: panRef.current.x, panY: panRef.current.y }
  }

  function adjustZoom(factor: number): void {
    const el = containerRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.width / 2, cy = rect.height / 2
    const newZoom = Math.max(0.2, Math.min(3, zoomRef.current * factor))
    applyZoom(newZoom)
    applyPan({ x: cx - (cx - panRef.current.x) * (newZoom / zoomRef.current), y: cy - (cy - panRef.current.y) * (newZoom / zoomRef.current) })
  }

  function fitView(): void {
    const el = containerRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const pad = 32
    const fitZoom = Math.min((rect.width - pad * 2) / CANVAS_W, (rect.height - pad * 2) / CANVAS_H, 1)
    applyZoom(fitZoom)
    applyPan({ x: (rect.width - CANVAS_W * fitZoom) / 2, y: (rect.height - CANVAS_H * fitZoom) / 2 })
  }

  const gridPx = GRID_SIZE * zoom
  const gridOX = ((pan.x % gridPx) + gridPx) % gridPx
  const gridOY = ((pan.y % gridPx) + gridPx) % gridPx

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden rounded-lg border"
      style={{
        cursor,
        backgroundImage: 'radial-gradient(circle, rgba(128,128,128,0.35) 1.5px, transparent 1.5px)',
        backgroundSize: `${gridPx}px ${gridPx}px`,
        backgroundPosition: `${gridOX}px ${gridOY}px`,
        minHeight: 360,
        userSelect: 'none'
      }}
      onMouseDown={onBgMouseDown}
    >
      {/* Transform layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
        {/* Static canvas */}
        <div
          style={{ width: CANVAS_W, height: CANVAS_H, position: 'relative' }}
          className="bg-card rounded-xl shadow-lg border border-border/60"
        >
          {tables.map((table) => {
            const occ = occMap.get(table.id as string) ?? null
            const { bg, text } = getTableStyle(table, occ)
            const x = table.x ?? 0
            const y = table.y ?? 0
            return (
              <button
                key={table.id as string}
                data-table-btn="1"
                onClick={() => onTableClick(table)}
                style={{ position: 'absolute', left: x, top: y, width: TABLE_SIZE, height: TABLE_SIZE, backgroundColor: bg, color: text }}
                className={`flex flex-col items-center justify-center rounded-xl shadow-md select-none transition-opacity ${
                  !table.isActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-85 active:scale-95'
                }`}
              >
                <span className="font-bold text-sm leading-tight">Mesa {table.tableNumber ?? '?'}</span>
                {(table.capacity ?? 0) > 0 && <span className="text-xs opacity-80">{table.capacity} pax</span>}
              </button>
            )
          })}

          {tables.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
              <p className="text-sm">No hay mesas en esta zona</p>
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {isCreatingOccupation && (
        <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-20 rounded-lg">
          <span className="text-sm text-muted-foreground">Abriendo mesa...</span>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/90 border rounded-lg px-2 py-1 shadow-sm">
        <button className="p-1 rounded hover:bg-muted" onClick={() => adjustZoom(0.85)}><Minus size={13} /></button>
        <span className="text-xs w-11 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
        <button className="p-1 rounded hover:bg-muted" onClick={() => adjustZoom(1.15)}><Plus size={13} /></button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <button className="text-xs px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground" onClick={fitView}>Fit</button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

function TableMapView({
  onFreeTableClick,
  onOccupiedTableClick,
  isCreatingOccupation
}: TableMapViewProps): JSX.Element {
  const { data: tables, isLoading: tablesLoading } = useTables()
  const { data: occupations, isLoading: occsLoading } = useTableOccupations()
  const { data: layers, isLoading: layersLoading } = useLayers()

  const [activeLayerId, setActiveLayerId] = useState<string>('')

  const occMap = useMemo(() => buildOccupationMap(occupations ?? []), [occupations])

  const tablesByLayer = useMemo(() => {
    const map = new Map<string, RestaurantTable[]>()
    for (const t of tables ?? []) {
      const lid = t.layer?.id as string | undefined
      if (!lid) continue
      if (!map.has(lid)) map.set(lid, [])
      map.get(lid)!.push(t)
    }
    return map
  }, [tables])

  const activeLayers = useMemo(
    () => (layers ?? []).filter((l) => tablesByLayer.has(l.id as string)),
    [layers, tablesByLayer]
  )

  useEffect(() => {
    if (!activeLayerId && activeLayers.length > 0) setActiveLayerId(activeLayers[0].id as string)
  }, [activeLayers, activeLayerId])

  function handleTableClick(table: RestaurantTable): void {
    if (!table.isActive || isCreatingOccupation) return
    const occ = occMap.get(table.id as string) ?? null
    if (!occ || occ.status === TableOccupationStatusEnum.Closed) {
      onFreeTableClick(table)
    } else {
      onOccupiedTableClick(table, occ)
    }
  }

  if (tablesLoading || occsLoading || layersLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Cargando mapa...</div>
  }

  if (activeLayers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No hay mesas configuradas en el mapa. Configúralas en &ldquo;Mapa de mesas&rdquo;.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Layer tabs */}
      <div className="flex gap-2 flex-wrap">
        {activeLayers.map((layer) => (
          <button
            key={layer.id as string}
            onClick={() => setActiveLayerId(layer.id as string)}
            className={`px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
              activeLayerId === (layer.id as string)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-background hover:bg-muted'
            }`}
          >
            {layer.name ?? '—'}
          </button>
        ))}
      </div>

      <LayerView
        key={activeLayerId}
        tables={tablesByLayer.get(activeLayerId) ?? []}
        occMap={occMap}
        onTableClick={handleTableClick}
        isCreatingOccupation={isCreatingOccupation ?? false}
      />

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <LegendItem color="#22c55e" label="Libre" />
        <LegendItem color="#f97316" label="Ocupada" />
        <LegendItem color="#ef4444" label="Reservada" />
        <LegendItem color="#9ca3af" label="Deshabilitada" />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }): JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </div>
  )
}

export default TableMapView
