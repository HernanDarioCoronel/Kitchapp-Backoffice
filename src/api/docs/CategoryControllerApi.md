# CategoryControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create15**](#create15) | **POST** /api/categories | |
|[**delete15**](#delete15) | **DELETE** /api/categories/{id} | |
|[**findAll15**](#findall15) | **GET** /api/categories | |
|[**findById15**](#findbyid15) | **GET** /api/categories/{id} | |
|[**update15**](#update15) | **PATCH** /api/categories/{id} | |

# **create15**
> Category create15(category)


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration,
    Category
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let category: Category; //

const { status, data } = await apiInstance.create15(
    category
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **category** | **Category**|  | |


### Return type

**Category**

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

# **delete15**
> delete15()


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete15(
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

# **findAll15**
> Array<Category> findAll15()


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

const { status, data } = await apiInstance.findAll15();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Category>**

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

# **findById15**
> Category findById15()


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById15(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Category**

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

# **update15**
> Category update15(category)


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration,
    Category
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let id: string; // (default to undefined)
let category: Category; //

const { status, data } = await apiInstance.update15(
    id,
    category
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **category** | **Category**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Category**

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

