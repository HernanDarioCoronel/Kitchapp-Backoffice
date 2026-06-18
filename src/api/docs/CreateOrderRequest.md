# CreateOrderRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tableOccupationId** | **string** |  | [default to undefined]
**employeeId** | **string** |  | [default to undefined]
**orderDishes** | [**Array&lt;CreateOrderDishRequest&gt;**](CreateOrderDishRequest.md) |  | [optional] [default to undefined]
**orderConsumables** | [**Array&lt;CreateOrderConsumableRequest&gt;**](CreateOrderConsumableRequest.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CreateOrderRequest } from './api';

const instance: CreateOrderRequest = {
    tableOccupationId,
    employeeId,
    orderDishes,
    orderConsumables,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
