# ReservationControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create6**](#create6) | **POST** /api/reservations | |
|[**delete6**](#delete6) | **DELETE** /api/reservations/{id} | |
|[**findAll6**](#findall6) | **GET** /api/reservations | |
|[**findById6**](#findbyid6) | **GET** /api/reservations/{id} | |
|[**update6**](#update6) | **PATCH** /api/reservations/{id} | |

# **create6**
> Reservation create6(reservation)


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration,
    Reservation
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let reservation: Reservation; //

const { status, data } = await apiInstance.create6(
    reservation
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reservation** | **Reservation**|  | |


### Return type

**Reservation**

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

# **delete6**
> delete6()


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete6(
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

# **findAll6**
> Array<Reservation> findAll6()


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

const { status, data } = await apiInstance.findAll6();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Reservation>**

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

# **findById6**
> Reservation findById6()


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById6(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Reservation**

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

# **update6**
> Reservation update6(reservation)


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration,
    Reservation
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let id: string; // (default to undefined)
let reservation: Reservation; //

const { status, data } = await apiInstance.update6(
    id,
    reservation
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reservation** | **Reservation**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Reservation**

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

