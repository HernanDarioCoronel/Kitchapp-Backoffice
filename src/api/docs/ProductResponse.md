# ProductResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**sku** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**category** | [**Category**](Category.md) |  | [optional] [default to undefined]
**unitType** | [**UnitType**](UnitType.md) |  | [optional] [default to undefined]
**caloriesPer100g** | **number** |  | [optional] [default to undefined]
**isActive** | **boolean** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**allergenIds** | **Set&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { ProductResponse } from './api';

const instance: ProductResponse = {
    id,
    sku,
    name,
    type,
    category,
    unitType,
    caloriesPer100g,
    isActive,
    createdAt,
    allergenIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
