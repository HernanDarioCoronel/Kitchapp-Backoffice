# InventoryMovementControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create12**](#create12) | **POST** /api/inventory-movements | |
|[**delete12**](#delete12) | **DELETE** /api/inventory-movements/{id} | |
|[**findAll12**](#findall12) | **GET** /api/inventory-movements | |
|[**findById12**](#findbyid12) | **GET** /api/inventory-movements/{id} | |
|[**update12**](#update12) | **PATCH** /api/inventory-movements/{id} | |

# **create12**
> InventoryMovement create12(inventoryMovement)


### Example

```typescript
import {
    InventoryMovementControllerApi,
    Configuration,
    InventoryMovement
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryMovementControllerApi(configuration);

let inventoryMovement: InventoryMovement; //

const { status, data } = await apiInstance.create12(
    inventoryMovement
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inventoryMovement** | **InventoryMovement**|  | |


### Return type

**InventoryMovement**

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

# **delete12**
> delete12()


### Example

```typescript
import {
    InventoryMovementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryMovementControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete12(
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

# **findAll12**
> Array<InventoryMovement> findAll12()


### Example

```typescript
import {
    InventoryMovementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryMovementControllerApi(configuration);

const { status, data } = await apiInstance.findAll12();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<InventoryMovement>**

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

# **findById12**
> InventoryMovement findById12()


### Example

```typescript
import {
    InventoryMovementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryMovementControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById12(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**InventoryMovement**

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

# **update12**
> InventoryMovement update12(inventoryMovement)


### Example

```typescript
import {
    InventoryMovementControllerApi,
    Configuration,
    InventoryMovement
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryMovementControllerApi(configuration);

let id: string; // (default to undefined)
let inventoryMovement: InventoryMovement; //

const { status, data } = await apiInstance.update12(
    id,
    inventoryMovement
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inventoryMovement** | **InventoryMovement**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**InventoryMovement**

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

