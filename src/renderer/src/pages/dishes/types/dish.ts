import { UUID } from 'crypto'

interface UnitType {
  id: UUID
  name: string
  abbreviation: string
}

interface Allergen {
  id: UUID
  name: string
  description: string
  product: string[]
}

interface Category {
  id: UUID
  name: string
  description: string
  type: string
  active: boolean
  createdAt: string
}

interface Product {
  id: UUID
  sku: string
  name: string
  type: string
  category: Category
  unitType: UnitType
  caloriesPer100g: number
  isActive: boolean
  createdAt: string
  allergens: Allergen[]
}

interface DishIngredient {
  id: UUID
  product: Product
  quantity: number
  optional: boolean
}

interface Dish {
  id: UUID
  name: string
  description: string
  prepTime: number
  price: number
  dishCategory: Category
  isAvailable: boolean
  imageUrl: string
  createdAt: string
  dishIngredientList: DishIngredient[]
}

export type { Dish, DishIngredient, Product, Category, Allergen, UnitType }
