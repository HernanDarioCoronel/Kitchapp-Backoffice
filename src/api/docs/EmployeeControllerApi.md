# EmployeeControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create13**](#create13) | **POST** /api/employees | |
|[**delete13**](#delete13) | **DELETE** /api/employees/{id} | |
|[**findAll13**](#findall13) | **GET** /api/employees | |
|[**findById13**](#findbyid13) | **GET** /api/employees/{id} | |
|[**update13**](#update13) | **PATCH** /api/employees/{id} | |

# **create13**
> Employee create13(employee)


### Example

```typescript
import {
    EmployeeControllerApi,
    Configuration,
    Employee
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeeControllerApi(configuration);

let employee: Employee; //

const { status, data } = await apiInstance.create13(
    employee
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **employee** | **Employee**|  | |


### Return type

**Employee**

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

# **delete13**
> delete13()


### Example

```typescript
import {
    EmployeeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeeControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.delete13(
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

# **findAll13**
> Array<Employee> findAll13()


### Example

```typescript
import {
    EmployeeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeeControllerApi(configuration);

const { status, data } = await apiInstance.findAll13();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Employee>**

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

# **findById13**
> Employee findById13()


### Example

```typescript
import {
    EmployeeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeeControllerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findById13(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Employee**

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

# **update13**
> Employee update13(employee)


### Example

```typescript
import {
    EmployeeControllerApi,
    Configuration,
    Employee
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeeControllerApi(configuration);

let id: string; // (default to undefined)
let employee: Employee; //

const { status, data } = await apiInstance.update13(
    id,
    employee
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **employee** | **Employee**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Employee**

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

