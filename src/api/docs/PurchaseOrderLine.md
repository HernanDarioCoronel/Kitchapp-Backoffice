# PurchaseOrderLine


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**order** | [**PurchaseOrder**](PurchaseOrder.md) |  | [optional] [default to undefined]
**product** | [**Product**](Product.md) |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**quantity** | **number** |  | [optional] [default to undefined]
**unitPrice** | **number** |  | [optional] [default to undefined]
**tax** | [**Tax**](Tax.md) |  | [optional] [default to undefined]
**lineSubtotal** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { PurchaseOrderLine } from './api';

const instance: PurchaseOrderLine = {
    id,
    order,
    product,
    description,
    quantity,
    unitPrice,
    tax,
    lineSubtotal,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
