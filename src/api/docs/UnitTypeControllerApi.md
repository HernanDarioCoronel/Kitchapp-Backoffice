# UnitTypeControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_delete**](#_delete) | **DELETE** /api/unit-types/{id} | |
|[**create**](#create) | **POST** /api/unit-types | |
|[**findAll**](#findall) | **GET** /api/unit-types | |
|[**findById**](#findbyid) | **GET** /api/unit-types/{id} | |
|[**update**](#update) | **PATCH** /api/unit-types/{id} | |

# **_delete**
> _delete()


### Example

```typescript
import {
    UnitTypeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UnitTypeControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance._delete(
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

# **create**
> UnitType create(unitType)


### Example

```typescript
import {
    UnitTypeControllerApi,
    Configuration,
    UnitType
} from './api';

const configuration = new Configuration();
const apiInstance = new UnitTypeControllerApi(configuration);

let unitType: UnitType; //

const { status, data } = await apiInstance.create(
    unitType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **unitType** | **UnitType**|  | |


### Return type

**UnitType**

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

# **findAll**
> Array<UnitType> findAll()


### Example

```typescript
import {
    UnitTypeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UnitTypeControllerApi(configuration);

const { status, data } = await apiInstance.findAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<UnitType>**

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

# **findById**
> UnitType findById()


### Example

```typescript
import {
    UnitTypeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UnitTypeControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**UnitType**

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

# **update**
> UnitType update(unitType)


### Example

```typescript
import {
    UnitTypeControllerApi,
    Configuration,
    UnitType
} from './api';

const configuration = new Configuration();
const apiInstance = new UnitTypeControllerApi(configuration);

let id: string; // (default to undefined)
let unitType: UnitType; //

const { status, data } = await apiInstance.update(
    id,
    unitType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **unitType** | **UnitType**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**UnitType**

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

