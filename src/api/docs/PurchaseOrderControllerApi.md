# PurchaseOrderControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create7**](#create7) | **POST** /api/purchase-orders | |
|[**delete7**](#delete7) | **DELETE** /api/purchase-orders/{id} | |
|[**findAll7**](#findall7) | **GET** /api/purchase-orders | |
|[**findById7**](#findbyid7) | **GET** /api/purchase-orders/{id} | |
|[**update7**](#update7) | **PATCH** /api/purchase-orders/{id} | |

# **create7**
> PurchaseOrder create7(purchaseOrder)


### Example

```typescript
import {
    PurchaseOrderControllerApi,
    Configuration,
    PurchaseOrder
} from './api';

const configuration = new Configuration();
const apiInstance = new PurchaseOrderControllerApi(configuration);

let purchaseOrder: PurchaseOrder; //

const { status, data } = await apiInstance.create7(
    purchaseOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **purchaseOrder** | **PurchaseOrder**|  | |


### Return type

**PurchaseOrder**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete7**
> delete7()


### Example

```typescript
import {
    PurchaseOrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PurchaseOrderControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete7(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **findAll7**
> Array<PurchaseOrder> findAll7()


### Example

```typescript
import {
    PurchaseOrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PurchaseOrderControllerApi(configuration);

const { status, data } = await apiInstance.findAll7();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<PurchaseOrder>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **findById7**
> PurchaseOrder findById7()


### Example

```typescript
import {
    PurchaseOrderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PurchaseOrderControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById7(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**PurchaseOrder**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update7**
> PurchaseOrder update7(purchaseOrder)


### Example

```typescript
import {
    PurchaseOrderControllerApi,
    Configuration,
    PurchaseOrder
} from './api';

const configuration = new Configuration();
const apiInstance = new PurchaseOrderControllerApi(configuration);

let id: string; // (default to undefined)
let purchaseOrder: PurchaseOrder; //

const { status, data } = await apiInstance.update7(
    id,
    purchaseOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **purchaseOrder** | **PurchaseOrder**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**PurchaseOrder**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

