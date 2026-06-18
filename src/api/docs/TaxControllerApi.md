# TaxControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create1**](#create1) | **POST** /api/taxes | |
|[**delete1**](#delete1) | **DELETE** /api/taxes/{id} | |
|[**findAll1**](#findall1) | **GET** /api/taxes | |
|[**findById1**](#findbyid1) | **GET** /api/taxes/{id} | |
|[**update1**](#update1) | **PATCH** /api/taxes/{id} | |

# **create1**
> Tax create1(tax)


### Example

```typescript
import {
    TaxControllerApi,
    Configuration,
    Tax
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxControllerApi(configuration);

let tax: Tax; //

const { status, data } = await apiInstance.create1(
    tax
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tax** | **Tax**|  | |


### Return type

**Tax**

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

# **delete1**
> delete1()


### Example

```typescript
import {
    TaxControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete1(
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

# **findAll1**
> Array<Tax> findAll1()


### Example

```typescript
import {
    TaxControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxControllerApi(configuration);

const { status, data } = await apiInstance.findAll1();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Tax>**

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

# **findById1**
> Tax findById1()


### Example

```typescript
import {
    TaxControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Tax**

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

# **update1**
> Tax update1(tax)


### Example

```typescript
import {
    TaxControllerApi,
    Configuration,
    Tax
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxControllerApi(configuration);

let id: string; // (default to undefined)
let tax: Tax; //

const { status, data } = await apiInstance.update1(
    id,
    tax
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tax** | **Tax**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Tax**

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

