// src/services/http.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

http.interceptors.request.use(config => {
  // attach token if exists
  return config;
});

http.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);
