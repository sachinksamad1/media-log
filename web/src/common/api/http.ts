import axios from 'axios'
import { authService } from '@/modules/user/api/authService'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    // 'Content-Type': 'application/json', // Let axios set this automatically
  },
})

httpClient.interceptors.request.use(async (config) => {
  const token = await authService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      authService.logout()
    }
    return Promise.reject(error)
  }
)

export default httpClient
