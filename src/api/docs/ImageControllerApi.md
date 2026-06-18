# ImageControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**serve**](#serve) | **GET** /api/images/{filename} | |
|[**upload**](#upload) | **POST** /api/images | |

# **serve**
> File serve()


### Example

```typescript
import {
    ImageControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ImageControllerApi(configuration);

let filename: string; // (default to undefined)

const { status, data } = await apiInstance.serve(
    filename
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filename** | [**string**] |  | defaults to undefined|


### Return type

**File**

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

# **upload**
> { [key: string]: any; } upload()


### Example

```typescript
import {
    ImageControllerApi,
    Configuration,
    UploadRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ImageControllerApi(configuration);

let uploadRequest: UploadRequest; // (optional)

const { status, data } = await apiInstance.upload(
    uploadRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadRequest** | **UploadRequest**|  | |


### Return type

**{ [key: string]: any; }**

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

