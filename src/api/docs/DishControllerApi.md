# DishControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create14**](#create14) | **POST** /api/dishes | |
|[**delete14**](#delete14) | **DELETE** /api/dishes/{id} | |
|[**findAll14**](#findall14) | **GET** /api/dishes | |
|[**findById14**](#findbyid14) | **GET** /api/dishes/{id} | |
|[**update14**](#update14) | **PATCH** /api/dishes/{id} | |

# **create14**
> Dish create14(dish)


### Example

```typescript
import {
    DishControllerApi,
    Configuration,
    Dish
} from './api';

const configuration = new Configuration();
const apiInstance = new DishControllerApi(configuration);

let dish: Dish; //

const { status, data } = await apiInstance.create14(
    dish
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dish** | **Dish**|  | |


### Return type

**Dish**

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

# **delete14**
> delete14()


### Example

```typescript
import {
    DishControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DishControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete14(
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

# **findAll14**
> Array<Dish> findAll14()


### Example

```typescript
import {
    DishControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DishControllerApi(configuration);

let withIngredients: number; // (optional) (default to 0)

const { status, data } = await apiInstance.findAll14(
    withIngredients
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **withIngredients** | [**number**] |  | (optional) defaults to 0|


### Return type

**Array<Dish>**

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

# **findById14**
> Dish findById14()


### Example

```typescript
import {
    DishControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DishControllerApi(configuration);

let id: string; // (default to undefined)
let withIngredients: number; // (optional) (default to 0)

const { status, data } = await apiInstance.findById14(
    id,
    withIngredients
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **withIngredients** | [**number**] |  | (optional) defaults to 0|


### Return type

**Dish**

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

# **update14**
> Dish update14(dish)


### Example

```typescript
import {
    DishControllerApi,
    Configuration,
    Dish
} from './api';

const configuration = new Configuration();
const apiInstance = new DishControllerApi(configuration);

let id: string; // (default to undefined)
let dish: Dish; //

const { status, data } = await apiInstance.update14(
    id,
    dish
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dish** | **Dish**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Dish**

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

