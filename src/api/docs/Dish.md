# Dish


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**prepTime** | **number** |  | [optional] [default to undefined]
**price** | **number** |  | [optional] [default to undefined]
**dishCategory** | [**Category**](Category.md) |  | [optional] [default to undefined]
**isAvailable** | **boolean** |  | [optional] [default to undefined]
**imageUrl** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**dishIngredientList** | [**Array&lt;DishIngredient&gt;**](DishIngredient.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Dish } from './api';

const instance: Dish = {
    id,
    name,
    description,
    prepTime,
    price,
    dishCategory,
    isAvailable,
    imageUrl,
    createdAt,
    dishIngredientList,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
