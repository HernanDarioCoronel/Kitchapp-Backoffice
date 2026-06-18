# SupplierControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create4**](#create4) | **POST** /api/suppliers | |
|[**delete4**](#delete4) | **DELETE** /api/suppliers/{id} | |
|[**findAll4**](#findall4) | **GET** /api/suppliers | |
|[**findById4**](#findbyid4) | **GET** /api/suppliers/{id} | |
|[**update4**](#update4) | **PATCH** /api/suppliers/{id} | |

# **create4**
> Supplier create4(supplier)


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration,
    Supplier
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let supplier: Supplier; //

const { status, data } = await apiInstance.create4(
    supplier
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **supplier** | **Supplier**|  | |


### Return type

**Supplier**

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

# **delete4**
> delete4()


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete4(
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

# **findAll4**
> Array<Supplier> findAll4()


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

const { status, data } = await apiInstance.findAll4();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Supplier>**

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

# **findById4**
> Supplier findById4()


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById4(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Supplier**

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

# **update4**
> Supplier update4(supplier)


### Example

```typescript
import {
    SupplierControllerApi,
    Configuration,
    Supplier
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierControllerApi(configuration);

let id: string; // (default to undefined)
let supplier: Supplier; //

const { status, data } = await apiInstance.update4(
    id,
    supplier
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **supplier** | **Supplier**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Supplier**

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

