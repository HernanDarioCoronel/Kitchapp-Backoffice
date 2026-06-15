interface Point {
  x: number
  y: number
}

export function parseLayerShape(shape: string | undefined): Point[] | null {
  if (!shape) return null
  try {
    const parsed = JSON.parse(shape) as [number, number][]
    if (!Array.isArray(parsed) || parsed.length < 3) return null
    return parsed.map(([x, y]) => ({ x, y }))
  } catch {
    return null
  }
}

export function getCanvasDimensions(
  points: Point[] | null,
  fallback = { w: 1200, h: 800 }
): { w: number; h: number } {
  if (!points) return fallback
  const w = Math.max(...points.map((p) => p.x))
  const h = Math.max(...points.map((p) => p.y))
  return { w, h }
}

export function getClipPath(points: Point[] | null): string | undefined {
  if (!points) return undefined
  return `polygon(${points.map(({ x, y }) => `${x}px ${y}px`).join(', ')})`
}
