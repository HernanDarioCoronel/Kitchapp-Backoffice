# AllergenControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create17**](#create17) | **POST** /api/allergens | |
|[**delete17**](#delete17) | **DELETE** /api/allergens/{id} | |
|[**findAll17**](#findall17) | **GET** /api/allergens | |
|[**findById17**](#findbyid17) | **GET** /api/allergens/{id} | |
|[**update17**](#update17) | **PATCH** /api/allergens/{id} | |

# **create17**
> Allergen create17(allergen)


### Example

```typescript
import {
    AllergenControllerApi,
    Configuration,
    Allergen
} from './api';

const configuration = new Configuration();
const apiInstance = new AllergenControllerApi(configuration);

let allergen: Allergen; //

const { status, data } = await apiInstance.create17(
    allergen
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **allergen** | **Allergen**|  | |


### Return type

**Allergen**

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

# **delete17**
> delete17()


### Example

```typescript
import {
    AllergenControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AllergenControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete17(
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

# **findAll17**
> Array<Allergen> findAll17()


### Example

```typescript
import {
    AllergenControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AllergenControllerApi(configuration);

const { status, data } = await apiInstance.findAll17();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Allergen>**

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

# **findById17**
> Allergen findById17()


### Example

```typescript
import {
    AllergenControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AllergenControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById17(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Allergen**

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

# **update17**
> Allergen update17(allergen)


### Example

```typescript
import {
    AllergenControllerApi,
    Configuration,
    Allergen
} from './api';

const configuration = new Configuration();
const apiInstance = new AllergenControllerApi(configuration);

let id: string; // (default to undefined)
let allergen: Allergen; //

const { status, data } = await apiInstance.update17(
    id,
    allergen
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **allergen** | **Allergen**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Allergen**

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

