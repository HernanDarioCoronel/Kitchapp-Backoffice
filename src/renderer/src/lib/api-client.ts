import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// Interceptor para agregar el token a todas las peticiones
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
