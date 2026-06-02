import { Minus, Plus } from 'lucide-react'
import { JSX } from 'react'

function QuantityControls({
  count,
  onIncrement,
  onDecrement
}: {
  count: number
  onIncrement: (e: React.MouseEvent) => void
  onDecrement: (e: React.MouseEvent) => void
}): JSX.Element {
  return (
    <div
      className="flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-1 py-0.5 shadow"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary-foreground/20 transition-colors cursor-pointer"
        onClick={onDecrement}
      >
        <Minus size={12} />
      </button>
      <span className="text-sm font-bold min-w-5 text-center">{count}</span>
      <button
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary-foreground/20 transition-colors cursor-pointer"
        onClick={onIncrement}
      >
        <Plus size={12} />
      </button>
    </div>
  )
}

export default QuantityControls
