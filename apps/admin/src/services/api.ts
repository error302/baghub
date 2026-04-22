import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import type { ApiResponse, ApiError } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<unknown>>) => {
        if (error.response?.status === 401) {
          this.clearToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('admin_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('admin_token')
  }

  loadToken() {
    const token = localStorage.getItem('admin_token')
    if (token) {
      this.token = token
    }
    return !!token
  }

  getToken() {
    return this.token
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config)
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed')
    }
    return response.data.data as T
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed')
    }
    return response.data.data as T
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed')
    }
    return response.data.data as T
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed')
    }
    return response.data.data as T
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Request failed')
    }
    return response.data.data as T
  }

  // Upload file with progress
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Upload failed')
    }
    return response.data.data as T
  }
}

export const api = new ApiClient()

// Error handler helper
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>
    return (
      axiosError.response?.data.error || {
        message: axiosError.message || 'An error occurred',
        code: axiosError.code,
      }
    )
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  }
}
