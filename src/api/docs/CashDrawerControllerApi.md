# CashDrawerControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create16**](#create16) | **POST** /api/cash-drawers | |
|[**delete16**](#delete16) | **DELETE** /api/cash-drawers/{id} | |
|[**findAll16**](#findall16) | **GET** /api/cash-drawers | |
|[**findById16**](#findbyid16) | **GET** /api/cash-drawers/{id} | |
|[**update16**](#update16) | **PATCH** /api/cash-drawers/{id} | |

# **create16**
> CashDrawer create16(cashDrawer)


### Example

```typescript
import {
    CashDrawerControllerApi,
    Configuration,
    CashDrawer
} from './api';

const configuration = new Configuration();
const apiInstance = new CashDrawerControllerApi(configuration);

let cashDrawer: CashDrawer; //

const { status, data } = await apiInstance.create16(
    cashDrawer
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cashDrawer** | **CashDrawer**|  | |


### Return type

**CashDrawer**

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

# **delete16**
> delete16()


### Example

```typescript
import {
    CashDrawerControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CashDrawerControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete16(
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

# **findAll16**
> Array<CashDrawer> findAll16()


### Example

```typescript
import {
    CashDrawerControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CashDrawerControllerApi(configuration);

const { status, data } = await apiInstance.findAll16();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CashDrawer>**

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

# **findById16**
> CashDrawer findById16()


### Example

```typescript
import {
    CashDrawerControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CashDrawerControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById16(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**CashDrawer**

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

# **update16**
> CashDrawer update16(cashDrawer)


### Example

```typescript
import {
    CashDrawerControllerApi,
    Configuration,
    CashDrawer
} from './api';

const configuration = new Configuration();
const apiInstance = new CashDrawerControllerApi(configuration);

let id: string; // (default to undefined)
let cashDrawer: CashDrawer; //

const { status, data } = await apiInstance.update16(
    id,
    cashDrawer
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cashDrawer** | **CashDrawer**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**CashDrawer**

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

