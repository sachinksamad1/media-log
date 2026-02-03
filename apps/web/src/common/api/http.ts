import axios from 'axios'
import { authService } from '@/modules/user/api/authService'
import config from '@/config/env'

const httpClient = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    // 'Content-Type': 'application/json', // Axios set this automatically
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
    if (error.response?.status === 401) {
      authService.logout()
    }
    return Promise.reject(error)
  }
)

export default httpClient
