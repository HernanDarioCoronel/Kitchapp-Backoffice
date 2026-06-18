import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

apiClient.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/refresh')) {
    return config
  }

  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null): void {
  pendingQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)))
  pendingQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest?._retry) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        localStorage.removeItem('authToken')
        window.location.reload()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            },
            reject
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await apiClient.post<{ accessToken: string; refreshToken: string; expiresIn: number }>(
          '/auth/refresh',
          { refreshToken }
        )
        localStorage.setItem('authToken', data.accessToken)
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
        apiClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        processQueue(null, data.accessToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        window.location.reload()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
