import { JSX, useEffect, useRef, useState } from 'react'
import { Layer, RestaurantTable } from '@api/api'
import {
  useLayers,
  useCreateLayer,
  useUpdateLayer,
  useDeleteLayer,
  useTables,
  useCreateTable,
  useUpdateTable,
  useDeleteTable
} from '@renderer/pages/masters/hooks/useMasters'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription
} from '@renderer/components/ui/dialog'
import { Check, Edit2, Minus, Plus, Trash2, X } from 'lucide-react'

const TABLE_SIZE = 90
const GRID_SIZE = 40
const CANVAS_W = 1600
const CANVAS_H = 900

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface Point { x: number; y: number }

function nextTableNumber(tables: RestaurantTable[]): number {
  if (tables.length === 0) return 1
  return Math.max(...tables.map((t) => t.tableNumber ?? 0)) + 1
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

// ─── Capacity dialog ──────────────────────────────────────────────────────────

interface CapacityDialogProps {
  open: boolean
  onClose: () => void
  title: string
  initial?: string
  onSave: (capacity: number) => void
}

function CapacityDialog({ open, onClose, title, initial, onSave }: CapacityDialogProps): JSX.Element {
  const [capacity, setCapacity] = useState(initial ?? '')
  useEffect(() => { if (open) setCapacity(initial ?? '') }, [open])
  function handleSave(): void {
    const c = parseInt(capacity, 10)
    onSave(isNaN(c) ? 0 : Math.max(0, c))
    onClose()
  }
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xs">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="grid gap-2 py-2">
          <Label>Capacidad (pax)</Label>
          <Input
            type="number" min={0} value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Ej. 4" autoFocus
          />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost" onClick={onClose}>Cancelar</Button></DialogClose>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Layer canvas ─────────────────────────────────────────────────────────────

interface LayerCanvasProps {
  layerId: string
  tables: RestaurantTable[]
  droppedTableId: string | null
  onUpdateTable: (id: string, patch: Partial<RestaurantTable>) => void
  onDeleteTable: (id: string) => void
  onTableDropped: (id: string, pos: Point) => void
  onEditCapacity: (table: RestaurantTable) => void
}

function LayerCanvas({
  layerId, tables, droppedTableId,
  onUpdateTable, onDeleteTable, onTableDropped, onEditCapacity
}: LayerCanvasProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)

  const panRef = useRef<Point>({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const [pan, setPanState] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoomState] = useState(1)

  function applyPan(v: Point): void { panRef.current = v; setPanState(v) }
  function applyZoom(v: number): void { zoomRef.current = v; setZoomState(v) }

  const localPosRef = useRef<Map<string, Point>>(new Map())
  const [localPositions, setLocalPositions] = useState<Map<string, Point>>(new Map())
  function setLocalPos(id: string, pos: Point): void {
    localPosRef.current.set(id, pos)
    setLocalPositions(new Map(localPosRef.current))
  }

  type DragType = 'pan' | 'table'
  const modeRef = useRef<'idle' | 'active'>('idle')
  const [cursor, setCursor] = useState('default')
  const dragRef = useRef<{
    type: DragType
    startMouseX: number; startMouseY: number
    startPanX: number; startPanY: number
    tableId: string | null; tableStartX: number; tableStartY: number
  } | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Auto-fit canvas in viewport on mount
  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const pad = 32
    const fitZoom = Math.min((rect.width - pad * 2) / CANVAS_W, (rect.height - pad * 2) / CANVAS_H, 1)
    const fitPan = {
      x: (rect.width - CANVAS_W * fitZoom) / 2,
      y: (rect.height - CANVAS_H * fitZoom) / 2
    }
    panRef.current = fitPan; zoomRef.current = fitZoom
    setPanState(fitPan); setZoomState(fitZoom)
  }, [])

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current; if (!el) return
    function onWheel(e: WheelEvent): void {
      e.preventDefault()
      const rect = el!.getBoundingClientRect()
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top
      const factor = e.deltaY < 0 ? 1.1 : 0.9
      const nz = Math.max(0.2, Math.min(3, zoomRef.current * factor))
      const newPan = {
        x: cx - (cx - panRef.current.x) * (nz / zoomRef.current),
        y: cy - (cy - panRef.current.y) * (nz / zoomRef.current)
      }
      applyZoom(nz); applyPan(newPan)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Global mousemove / mouseup
  useEffect(() => {
    function onMouseMove(e: MouseEvent): void {
      if (modeRef.current === 'idle' || !dragRef.current) return
      const d = dragRef.current
      if (d.type === 'pan') {
        applyPan({
          x: d.startPanX + (e.clientX - d.startMouseX),
          y: d.startPanY + (e.clientY - d.startMouseY)
        })
      } else if (d.type === 'table' && d.tableId) {
        const dx = Math.round((e.clientX - d.startMouseX) / zoomRef.current)
        const dy = Math.round((e.clientY - d.startMouseY) / zoomRef.current)
        setLocalPos(d.tableId, {
          x: clamp(d.tableStartX + dx, 0, CANVAS_W - TABLE_SIZE),
          y: clamp(d.tableStartY + dy, 0, CANVAS_H - TABLE_SIZE)
        })
      }
    }
    function onMouseUp(): void {
      if (modeRef.current === 'idle' || !dragRef.current) return
      const d = dragRef.current
      if (d.type === 'table' && d.tableId) {
        const pos = localPosRef.current.get(d.tableId)
        if (pos) { onUpdateTable(d.tableId, pos); onTableDropped(d.tableId, pos) }
      }
      modeRef.current = 'idle'; dragRef.current = null; setCursor('default')
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp) }
  }, [])

  function onBgMouseDown(e: React.MouseEvent): void {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('[data-table-node]')) return
    e.preventDefault()
    modeRef.current = 'active'; setCursor('grabbing')
    dragRef.current = { type: 'pan', startMouseX: e.clientX, startMouseY: e.clientY, startPanX: panRef.current.x, startPanY: panRef.current.y, tableId: null, tableStartX: 0, tableStartY: 0 }
  }

  function onTableMouseDown(e: React.MouseEvent, table: RestaurantTable): void {
    if (e.button !== 0) return
    e.preventDefault(); e.stopPropagation()
    const pos = localPosRef.current.get(table.id as string) ?? { x: table.x ?? 0, y: table.y ?? 0 }
    modeRef.current = 'active'; setCursor('grabbing')
    dragRef.current = { type: 'table', startMouseX: e.clientX, startMouseY: e.clientY, startPanX: panRef.current.x, startPanY: panRef.current.y, tableId: table.id as string, tableStartX: pos.x, tableStartY: pos.y }
  }

  function adjustZoom(factor: number): void {
    const el = containerRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.width / 2, cy = rect.height / 2
    const nz = Math.max(0.2, Math.min(3, zoomRef.current * factor))
    applyZoom(nz)
    applyPan({ x: cx - (cx - panRef.current.x) * (nz / zoomRef.current), y: cy - (cy - panRef.current.y) * (nz / zoomRef.current) })
  }

  function fitView(): void {
    const el = containerRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const pad = 32
    const fitZoom = Math.min((rect.width - pad * 2) / CANVAS_W, (rect.height - pad * 2) / CANVAS_H, 1)
    applyZoom(fitZoom)
    applyPan({ x: (rect.width - CANVAS_W * fitZoom) / 2, y: (rect.height - CANVAS_H * fitZoom) / 2 })
  }

  const layerTables = tables.filter((t) => t.layer?.id === layerId)

  const gridPx = GRID_SIZE * zoom
  const gridOX = ((pan.x % gridPx) + gridPx) % gridPx
  const gridOY = ((pan.y % gridPx) + gridPx) % gridPx

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden rounded-lg border bg-muted/30"
        style={{
          cursor,
          backgroundImage: 'radial-gradient(circle, rgba(128,128,128,0.3) 1.5px, transparent 1.5px)',
          backgroundSize: `${gridPx}px ${gridPx}px`,
          backgroundPosition: `${gridOX}px ${gridOY}px`,
          minHeight: 480,
          userSelect: 'none'
        }}
        onMouseDown={onBgMouseDown}
      >
        {/* Canvas transform layer */}
        <div style={{ position: 'absolute', top: 0, left: 0, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
          {/* Static bounded canvas */}
          <div
            style={{ width: CANVAS_W, height: CANVAS_H, position: 'relative' }}
            className="bg-card rounded-xl shadow-lg border border-border/60"
          >
            {/* Tables */}
            {layerTables.map((table) => {
              const livePos = localPositions.get(table.id as string)
              const x = livePos?.x ?? table.x ?? 0
              const y = livePos?.y ?? table.y ?? 0
              const isDragging = dragRef.current?.type === 'table' && dragRef.current.tableId === (table.id as string)
              const isSelected = droppedTableId === (table.id as string)
              return (
                <div
                  key={table.id as string}
                  data-table-node="1"
                  style={{ position: 'absolute', left: x, top: y, width: TABLE_SIZE, height: TABLE_SIZE, transition: isDragging ? 'none' : 'box-shadow 0.15s' }}
                  className={`group rounded-xl border-2 bg-background flex flex-col items-center justify-center select-none ${
                    isDragging ? 'border-primary shadow-2xl z-20'
                      : isSelected ? 'border-primary shadow-lg ring-2 ring-primary/30 z-15'
                      : 'border-border shadow-md z-10 hover:border-primary/60 hover:shadow-lg'
                  }`}
                >
                  <div
                    className="flex flex-col items-center justify-center flex-1 w-full cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => onTableMouseDown(e, table)}
                  >
                    <span className="font-semibold text-sm leading-tight pointer-events-none">Mesa {table.tableNumber ?? '?'}</span>
                    {(table.capacity ?? 0) > 0 && <span className="text-xs text-muted-foreground pointer-events-none">{table.capacity} pax</span>}
                  </div>
                  <div
                    className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <button className="p-0.5 rounded hover:bg-muted" onClick={() => onEditCapacity(table)} title="Editar"><Edit2 size={11} /></button>
                    <button className="p-0.5 rounded hover:bg-muted text-destructive" onClick={() => setDeletingId(table.id as string)} title="Eliminar"><Trash2 size={11} /></button>
                  </div>
                </div>
              )
            })}

            {/* Empty hint */}
            {layerTables.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                <p className="text-sm">Zona vacía</p>
                <p className="text-xs mt-1">Usa el botón "Mesa" para agregar mesas</p>
              </div>
            )}
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/90 border rounded-lg px-2 py-1 shadow-sm">
          <button className="p-1 rounded hover:bg-muted" onClick={() => adjustZoom(0.85)} title="Alejar"><Minus size={13} /></button>
          <span className="text-xs w-11 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button className="p-1 rounded hover:bg-muted" onClick={() => adjustZoom(1.15)} title="Acercar"><Plus size={13} /></button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <button className="text-xs px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground" onClick={fitView}>Fit</button>
        </div>
      </div>

      {/* Delete confirm */}
      <Dialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Eliminar mesa</DialogTitle>
            <DialogDescription>¿Eliminar esta mesa del sistema?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletingId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => { if (deletingId) onDeleteTable(deletingId); setDeletingId(null) }}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function TableMap(): JSX.Element {
  const { data: layers, isLoading: layersLoading } = useLayers()
  const { data: tables, isLoading: tablesLoading } = useTables()
  const { mutate: createLayer } = useCreateLayer()
  const { mutate: updateLayer } = useUpdateLayer()
  const { mutate: deleteLayer } = useDeleteLayer()
  const { mutate: createTable } = useCreateTable()
  const { mutate: updateTable } = useUpdateTable()
  const { mutate: deleteTable } = useDeleteTable()

  const [activeLayerId, setActiveLayerId] = useState<string>('')
  const [newLayerDialog, setNewLayerDialog] = useState(false)
  const [newLayerName, setNewLayerName] = useState('')
  const [renamingLayerId, setRenamingLayerId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [newTableDialog, setNewTableDialog] = useState(false)
  const [deleteLayerTarget, setDeleteLayerTarget] = useState<string | null>(null)
  const [editingCapacity, setEditingCapacity] = useState<RestaurantTable | null>(null)
  const [droppedTable, setDroppedTable] = useState<{ id: string; x: string; y: string } | null>(null)

  const allLayers = layers ?? []
  const allTables = tables ?? []

  useEffect(() => {
    if (!activeLayerId && allLayers.length > 0) setActiveLayerId(allLayers[0].id as string)
  }, [allLayers, activeLayerId])

  function handleCreateLayer(): void {
    if (!newLayerName.trim()) return
    createLayer({ name: newLayerName.trim() }, {
      onSuccess: (created) => { setActiveLayerId(created.id as string); setNewLayerName(''); setNewLayerDialog(false) }
    })
  }

  function startRenameLayer(layer: Layer): void { setRenamingLayerId(layer.id as string); setRenameValue(layer.name ?? '') }
  function commitRename(): void {
    if (!renamingLayerId || !renameValue.trim()) { setRenamingLayerId(null); return }
    updateLayer({ id: renamingLayerId, payload: { name: renameValue.trim() } })
    setRenamingLayerId(null)
  }

  function handleDeleteLayer(id: string): void {
    deleteLayer(id, {
      onSuccess: () => {
        if (activeLayerId === id) {
          const remaining = allLayers.filter((l) => l.id !== id)
          setActiveLayerId((remaining[0]?.id as string) ?? '')
        }
      }
    })
  }

  function handleUpdateTable(id: string, patch: Partial<RestaurantTable>): void {
    const table = allTables.find((t) => t.id === id)
    if (!table) return
    updateTable({ id, payload: { ...table, ...patch } })
  }

  function handleCreateTable(capacity: number): void {
    if (!activeLayerId) return
    createTable({
      tableNumber: nextTableNumber(allTables),
      capacity,
      isActive: true,
      x: Math.floor(CANVAS_W / 2 - TABLE_SIZE / 2),
      y: Math.floor(CANVAS_H / 2 - TABLE_SIZE / 2),
      layer: { id: activeLayerId }
    })
  }

  function handleTableDropped(id: string, pos: Point): void {
    setDroppedTable({ id, x: String(pos.x), y: String(pos.y) })
  }

  function commitPosition(): void {
    if (!droppedTable) return
    const x = parseInt(droppedTable.x, 10), y = parseInt(droppedTable.y, 10)
    if (!isNaN(x) && !isNaN(y)) {
      handleUpdateTable(droppedTable.id, {
        x: clamp(x, 0, CANVAS_W - TABLE_SIZE),
        y: clamp(y, 0, CANVAS_H - TABLE_SIZE)
      })
    }
    setDroppedTable(null)
  }

  if (layersLoading || tablesLoading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Cargando...</div>
  }

  const activeTable = droppedTable ? allTables.find((t) => t.id === droppedTable.id) : null

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mapa de mesas</h1>
        <Button size="sm" onClick={() => setNewLayerDialog(true)}><Plus size={16} className="mr-1" />Nueva zona</Button>
      </div>

      {allLayers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">No hay zonas. Crea una para empezar.</div>
      ) : (
        <>
          {/* Layer tabs */}
          <div className="flex gap-1 flex-wrap items-center">
            {allLayers.map((layer) => (
              <div key={layer.id as string} className="flex items-center">
                {renamingLayerId === (layer.id as string) ? (
                  <Input className="h-8 w-32 text-sm" value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenamingLayerId(null) }}
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setActiveLayerId(layer.id as string)}
                    onDoubleClick={() => startRenameLayer(layer)}
                    className={`px-3 py-1.5 text-sm font-medium border transition-colors ${
                      activeLayerId === (layer.id as string)
                        ? 'bg-primary text-primary-foreground border-primary rounded-l'
                        : 'border-border bg-background hover:bg-muted rounded'
                    }`}
                  >
                    {layer.name ?? '—'}
                  </button>
                )}
                {activeLayerId === (layer.id as string) && renamingLayerId !== (layer.id as string) && (
                  <div className="flex border-t border-b border-r border-border rounded-r overflow-hidden">
                    <button className="px-1.5 py-1.5 hover:bg-muted text-muted-foreground border-r border-border" onClick={() => startRenameLayer(layer)} title="Renombrar"><Edit2 size={13} /></button>
                    <button className="px-1.5 py-1.5 hover:bg-muted text-muted-foreground" onClick={() => setDeleteLayerTarget(layer.id as string)} title="Eliminar zona"><X size={13} /></button>
                  </div>
                )}
              </div>
            ))}
            <Button size="sm" variant="outline" className="h-8 ml-2" disabled={!activeLayerId} onClick={() => setNewTableDialog(true)}>
              <Plus size={14} className="mr-1" />Mesa
            </Button>
          </div>

          {/* Position bar */}
          {droppedTable && activeTable && (
            <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 border rounded-lg text-sm">
              <span className="font-medium shrink-0">Mesa {activeTable.tableNumber ?? '?'}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs">X</span>
                <Input className="h-7 w-20 text-xs" value={droppedTable.x}
                  onChange={(e) => setDroppedTable((s) => s ? { ...s, x: e.target.value } : s)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitPosition(); if (e.key === 'Escape') setDroppedTable(null) }}
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs">Y</span>
                <Input className="h-7 w-20 text-xs" value={droppedTable.y}
                  onChange={(e) => setDroppedTable((s) => s ? { ...s, y: e.target.value } : s)}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitPosition(); if (e.key === 'Escape') setDroppedTable(null) }}
                />
              </div>
              <Button size="sm" className="h-7 px-2" onClick={commitPosition}><Check size={13} /></Button>
              <button className="text-muted-foreground hover:text-foreground" onClick={() => setDroppedTable(null)}><X size={15} /></button>
            </div>
          )}

          {activeLayerId && (
            <LayerCanvas
              key={activeLayerId}
              layerId={activeLayerId}
              tables={allTables}
              droppedTableId={droppedTable?.id ?? null}
              onUpdateTable={handleUpdateTable}
              onDeleteTable={(id) => deleteTable(id)}
              onTableDropped={handleTableDropped}
              onEditCapacity={setEditingCapacity}
            />
          )}
        </>
      )}

      {/* New layer dialog */}
      <Dialog open={newLayerDialog} onOpenChange={(o) => !o && setNewLayerDialog(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nueva zona</DialogTitle></DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Nombre</Label>
            <Input value={newLayerName} onChange={(e) => setNewLayerName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateLayer()} placeholder="Ej. Terraza, Interior..." autoFocus />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
            <Button onClick={handleCreateLayer} disabled={!newLayerName.trim()}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete layer confirm */}
      <Dialog open={!!deleteLayerTarget} onOpenChange={(o) => !o && setDeleteLayerTarget(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Eliminar zona</DialogTitle>
            <DialogDescription>Las mesas de esta zona no serán eliminadas del sistema.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteLayerTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => { if (deleteLayerTarget) handleDeleteLayer(deleteLayerTarget); setDeleteLayerTarget(null) }}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New table dialog */}
      <CapacityDialog open={newTableDialog} onClose={() => setNewTableDialog(false)} title="Nueva mesa" onSave={handleCreateTable} />

      {/* Edit capacity dialog */}
      {editingCapacity && (
        <CapacityDialog
          open={true} onClose={() => setEditingCapacity(null)}
          title={`Editar Mesa ${editingCapacity.tableNumber ?? '?'}`}
          initial={String(editingCapacity.capacity ?? '')}
          onSave={(capacity) => { handleUpdateTable(editingCapacity.id as string, { capacity }); setEditingCapacity(null) }}
        />
      )}
    </div>
  )
}

export default TableMap
