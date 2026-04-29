interface UnitType {
  id: string
  name: string
  abbreviation: string
}

interface Allergen {
  id: string
  name: string
  description: string
  product: string[]
}

interface Category {
  id: string
  name: string
  description: string
  type: string
  active: boolean
  createdAt: string
}

interface Product {
  id: string
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
  id: string
  product: Product
  quantity: number
  optional: boolean
}

interface Dish {
  id: string
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
