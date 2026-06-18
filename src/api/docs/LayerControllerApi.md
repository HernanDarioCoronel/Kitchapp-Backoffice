# LayerControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create11**](#create11) | **POST** /api/layers | |
|[**delete11**](#delete11) | **DELETE** /api/layers/{id} | |
|[**findAll11**](#findall11) | **GET** /api/layers | |
|[**findById11**](#findbyid11) | **GET** /api/layers/{id} | |
|[**update11**](#update11) | **PATCH** /api/layers/{id} | |

# **create11**
> Layer create11(layer)


### Example

```typescript
import {
    LayerControllerApi,
    Configuration,
    Layer
} from './api';

const configuration = new Configuration();
const apiInstance = new LayerControllerApi(configuration);

let layer: Layer; //

const { status, data } = await apiInstance.create11(
    layer
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **layer** | **Layer**|  | |


### Return type

**Layer**

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

# **delete11**
> delete11()


### Example

```typescript
import {
    LayerControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LayerControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete11(
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

# **findAll11**
> Array<Layer> findAll11()


### Example

```typescript
import {
    LayerControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LayerControllerApi(configuration);

const { status, data } = await apiInstance.findAll11();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Layer>**

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

# **findById11**
> Layer findById11()


### Example

```typescript
import {
    LayerControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LayerControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById11(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Layer**

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

# **update11**
> Layer update11(layer)


### Example

```typescript
import {
    LayerControllerApi,
    Configuration,
    Layer
} from './api';

const configuration = new Configuration();
const apiInstance = new LayerControllerApi(configuration);

let id: string; // (default to undefined)
let layer: Layer; //

const { status, data } = await apiInstance.update11(
    id,
    layer
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **layer** | **Layer**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Layer**

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

