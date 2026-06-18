# RestaurantTableControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create2**](#create2) | **POST** /api/tables | |
|[**delete2**](#delete2) | **DELETE** /api/tables/{id} | |
|[**findAll2**](#findall2) | **GET** /api/tables | |
|[**findById2**](#findbyid2) | **GET** /api/tables/{id} | |
|[**update2**](#update2) | **PATCH** /api/tables/{id} | |

# **create2**
> RestaurantTable create2(restaurantTable)


### Example

```typescript
import {
    RestaurantTableControllerApi,
    Configuration,
    RestaurantTable
} from './api';

const configuration = new Configuration();
const apiInstance = new RestaurantTableControllerApi(configuration);

let restaurantTable: RestaurantTable; //

const { status, data } = await apiInstance.create2(
    restaurantTable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **restaurantTable** | **RestaurantTable**|  | |


### Return type

**RestaurantTable**

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

# **delete2**
> delete2()


### Example

```typescript
import {
    RestaurantTableControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RestaurantTableControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete2(
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

# **findAll2**
> Array<RestaurantTable> findAll2()


### Example

```typescript
import {
    RestaurantTableControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RestaurantTableControllerApi(configuration);

const { status, data } = await apiInstance.findAll2();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<RestaurantTable>**

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

# **findById2**
> RestaurantTable findById2()


### Example

```typescript
import {
    RestaurantTableControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RestaurantTableControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById2(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RestaurantTable**

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

# **update2**
> RestaurantTable update2(restaurantTable)


### Example

```typescript
import {
    RestaurantTableControllerApi,
    Configuration,
    RestaurantTable
} from './api';

const configuration = new Configuration();
const apiInstance = new RestaurantTableControllerApi(configuration);

let id: string; // (default to undefined)
let restaurantTable: RestaurantTable; //

const { status, data } = await apiInstance.update2(
    id,
    restaurantTable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **restaurantTable** | **RestaurantTable**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RestaurantTable**

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

