# Order


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**tableOccupation** | [**TableOccupation**](TableOccupation.md) |  | [optional] [default to undefined]
**employee** | [**Employee**](Employee.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**tip** | **number** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**closedAt** | **string** |  | [optional] [default to undefined]
**orderDishes** | [**Set&lt;OrderDish&gt;**](OrderDish.md) |  | [optional] [default to undefined]
**orderConsumableItems** | [**Set&lt;OrderConsumableItem&gt;**](OrderConsumableItem.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Order } from './api';

const instance: Order = {
    id,
    tableOccupation,
    employee,
    status,
    tip,
    createdAt,
    closedAt,
    orderDishes,
    orderConsumableItems,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
