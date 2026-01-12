import axios, { 
  type AxiosInstance, 
  type InternalAxiosRequestConfig, 
  type AxiosResponse 
} from "axios";

// 1. Create the instance
const http: AxiosInstance = axios.create({
  // Use environment variables for flexibility between dev/prod
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token"); // Or use a Pinia store
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return only the data object from the response
    return response.data;
  },
  (error) => {
    // Global error handling (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting...");
    }
    return Promise.reject(error);
  }
);

export { http };