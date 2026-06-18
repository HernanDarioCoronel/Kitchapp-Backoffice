# StockControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create5**](#create5) | **POST** /api/stock | |
|[**delete5**](#delete5) | **DELETE** /api/stock/{id} | |
|[**findAll5**](#findall5) | **GET** /api/stock | |
|[**findById5**](#findbyid5) | **GET** /api/stock/{id} | |
|[**update5**](#update5) | **PATCH** /api/stock/{id} | |

# **create5**
> Stock create5(stock)


### Example

```typescript
import {
    StockControllerApi,
    Configuration,
    Stock
} from './api';

const configuration = new Configuration();
const apiInstance = new StockControllerApi(configuration);

let stock: Stock; //

const { status, data } = await apiInstance.create5(
    stock
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stock** | **Stock**|  | |


### Return type

**Stock**

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

# **delete5**
> delete5()


### Example

```typescript
import {
    StockControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StockControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete5(
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

# **findAll5**
> Array<Stock> findAll5()


### Example

```typescript
import {
    StockControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StockControllerApi(configuration);

const { status, data } = await apiInstance.findAll5();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Stock>**

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

# **findById5**
> Stock findById5()


### Example

```typescript
import {
    StockControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StockControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById5(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Stock**

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

# **update5**
> Stock update5(stock)


### Example

```typescript
import {
    StockControllerApi,
    Configuration,
    Stock
} from './api';

const configuration = new Configuration();
const apiInstance = new StockControllerApi(configuration);

let id: string; // (default to undefined)
let stock: Stock; //

const { status, data } = await apiInstance.update5(
    id,
    stock
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stock** | **Stock**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Stock**

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

