# PurchaseOrder


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**supplier** | [**Supplier**](Supplier.md) |  | [optional] [default to undefined]
**orderNumber** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**dueDate** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**netAmount** | **number** |  | [optional] [default to undefined]
**taxAmount** | **number** |  | [optional] [default to undefined]
**total** | **number** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**purchaseOrderLines** | [**Array&lt;PurchaseOrderLine&gt;**](PurchaseOrderLine.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PurchaseOrder } from './api';

const instance: PurchaseOrder = {
    id,
    supplier,
    orderNumber,
    status,
    createdAt,
    dueDate,
    updatedAt,
    netAmount,
    taxAmount,
    total,
    notes,
    purchaseOrderLines,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
