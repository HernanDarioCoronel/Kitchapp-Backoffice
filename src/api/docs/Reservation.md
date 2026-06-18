# Reservation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**customerName** | **string** |  | [optional] [default to undefined]
**customerPhone** | **string** |  | [optional] [default to undefined]
**numGuests** | **number** |  | [optional] [default to undefined]
**reservationDate** | **string** |  | [optional] [default to undefined]
**restaurantTables** | [**RestaurantTable**](RestaurantTable.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Reservation } from './api';

const instance: Reservation = {
    id,
    customerName,
    customerPhone,
    numGuests,
    reservationDate,
    restaurantTables,
    status,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
