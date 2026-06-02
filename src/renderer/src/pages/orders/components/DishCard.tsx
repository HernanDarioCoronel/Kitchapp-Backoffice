import { Dish } from '@api/api'
import { Badge } from '@renderer/components/ui/badge'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import { JSX } from 'react'
import QuantityControls from './QuantityControls'
import { Timer } from 'lucide-react'
import getImageUrl from '../utils/getImageUrl'

function DishCard({
  dish,
  count,
  onIncrement,
  onDecrement
}: {
  dish: Dish
  count: number
  onIncrement: () => void
  onDecrement: () => void
}): JSX.Element {
  return (
    <Card
      className={`relative w-72 flex-none cursor-pointer select-none transition-all ${count > 0 ? 'ring-2 ring-primary' : ''}`}
      style={{ borderColor: dish.dishCategory?.color }}
      onClick={onIncrement}
    >
      <CardHeader>
        <h3 className="w-full truncate text-lg font-bold">{dish.name}</h3>
        {dish.dishCategory && (
          <Badge
            className="w-fit border"
            style={{
              borderColor: dish.dishCategory.color,
              backgroundColor: `${dish.dishCategory.color}20`,
              color: dish.dishCategory.color
            }}
          >
            {dish.dishCategory.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="mb-4 h-40 w-full rounded-md bg-center bg-cover relative"
          style={{ backgroundImage: `url(${getImageUrl(dish.imageUrl)})` }}
        >
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
        <p className="truncate text-muted-foreground text-sm">{dish.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-muted-foreground">
            <Timer className="inline-block mr-1" size={16} />
            <p className="text-sm">{dish.prepTime}min</p>
          </div>
          <p className="text-right font-bold text-xl">${dish.price!.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default DishCard
