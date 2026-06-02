import type { Product } from '@api/api'
import { Badge } from '@renderer/components/ui/badge'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import { JSX } from 'react'
import QuantityControls from './QuantityControls'
import { Package } from 'lucide-react'

function ProductCard({
  product,
  count,
  onIncrement,
  onDecrement
}: {
  product: Product
  count: number
  onIncrement: () => void
  onDecrement: () => void
}): JSX.Element {
  const categoryColor = product.category?.color
  return (
    <Card
      className={`relative w-72 flex-none cursor-pointer select-none transition-all ${count > 0 ? 'ring-2 ring-primary' : ''}`}
      style={{ borderColor: categoryColor }}
      onClick={onIncrement}
    >
      <CardHeader>
        <h3 className="w-full truncate text-lg font-bold">{product.name}</h3>
        {product.category && (
          <Badge
            className="w-fit border"
            style={{
              borderColor: categoryColor,
              backgroundColor: `${categoryColor}20`,
              color: categoryColor
            }}
          >
            {product.category.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-40 w-full rounded-md bg-muted flex items-center justify-center relative">
          <Package size={48} className="text-muted-foreground" />
          {count > 0 && (
            <div className="absolute bottom-2 right-2">
              <QuantityControls
                count={count}
                onIncrement={(e) => {
                  e.stopPropagation()
                  onIncrement()
                }}
                onDecrement={(e) => {
                  e.stopPropagation()
                  onDecrement()
                }}
              />
            </div>
          )}
        </div>
        <p className="truncate text-muted-foreground text-sm">
          {product.sku && <span className="font-mono">{product.sku}</span>}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">{product.unitType?.abbreviation ?? '—'}</p>
          {product.caloriesPer100g != null && (
            <p className="text-right font-bold text-xl">{product.caloriesPer100g} kcal</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
