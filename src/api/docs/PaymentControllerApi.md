# PaymentControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create9**](#create9) | **POST** /api/payments | |
|[**delete9**](#delete9) | **DELETE** /api/payments/{id} | |
|[**findAll9**](#findall9) | **GET** /api/payments | |
|[**findById9**](#findbyid9) | **GET** /api/payments/{id} | |
|[**update9**](#update9) | **PATCH** /api/payments/{id} | |

# **create9**
> Payment create9(payment)


### Example

```typescript
import {
    PaymentControllerApi,
    Configuration,
    Payment
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentControllerApi(configuration);

let payment: Payment; //

const { status, data } = await apiInstance.create9(
    payment
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **payment** | **Payment**|  | |


### Return type

**Payment**

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

# **delete9**
> delete9()


### Example

```typescript
import {
    PaymentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete9(
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

# **findAll9**
> Array<Payment> findAll9()


### Example

```typescript
import {
    PaymentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentControllerApi(configuration);

const { status, data } = await apiInstance.findAll9();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Payment>**

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

# **findById9**
> Payment findById9()


### Example

```typescript
import {
    PaymentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById9(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Payment**

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

# **update9**
> Payment update9(payment)


### Example

```typescript
import {
    PaymentControllerApi,
    Configuration,
    Payment
} from './api';

const configuration = new Configuration();
const apiInstance = new PaymentControllerApi(configuration);

let id: string; // (default to undefined)
let payment: Payment; //

const { status, data } = await apiInstance.update9(
    id,
    payment
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **payment** | **Payment**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Payment**

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

