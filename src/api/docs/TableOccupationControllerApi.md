# TableOccupationControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create3**](#create3) | **POST** /api/table-occupations | |
|[**delete3**](#delete3) | **DELETE** /api/table-occupations/{id} | |
|[**findAll3**](#findall3) | **GET** /api/table-occupations | |
|[**findById3**](#findbyid3) | **GET** /api/table-occupations/{id} | |
|[**findOpenByTableId**](#findopenbytableid) | **GET** /api/table-occupations/tables/{tableId}/open | |
|[**update3**](#update3) | **PATCH** /api/table-occupations/{id} | |

# **create3**
> TableOccupation create3(tableOccupation)


### Example

```typescript
import {
    TableOccupationControllerApi,
    Configuration,
    TableOccupation
} from './api';

const configuration = new Configuration();
const apiInstance = new TableOccupationControllerApi(configuration);

let tableOccupation: TableOccupation; //

const { status, data } = await apiInstance.create3(
    tableOccupation
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tableOccupation** | **TableOccupation**|  | |


### Return type

**TableOccupation**

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

# **delete3**
> delete3()


### Example

```typescript
import {
    TableOccupationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TableOccupationControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete3(
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

# **findAll3**
> Array<TableOccupation> findAll3()


### Example

```typescript
import {
    TableOccupationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TableOccupationControllerApi(configuration);

const { status, data } = await apiInstance.findAll3();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TableOccupation>**

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

# **findById3**
> TableOccupation findById3()


### Example

```typescript
import {
    TableOccupationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TableOccupationControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById3(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**TableOccupation**

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

# **findOpenByTableId**
> TableOccupation findOpenByTableId()


### Example

```typescript
import {
    TableOccupationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TableOccupationControllerApi(configuration);

let tableId: string; // (default to undefined)

const { status, data } = await apiInstance.findOpenByTableId(
    tableId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tableId** | [**string**] |  | defaults to undefined|


### Return type

**TableOccupation**

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

# **update3**
> TableOccupation update3(tableOccupation)


### Example

```typescript
import {
    TableOccupationControllerApi,
    Configuration,
    TableOccupation
} from './api';

const configuration = new Configuration();
const apiInstance = new TableOccupationControllerApi(configuration);

let id: string; // (default to undefined)
let tableOccupation: TableOccupation; //

const { status, data } = await apiInstance.update3(
    id,
    tableOccupation
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tableOccupation** | **TableOccupation**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**TableOccupation**

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

