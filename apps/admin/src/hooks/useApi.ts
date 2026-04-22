import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { api } from '@/services/api'
import type { AxiosError } from 'axios'

// Generic query hook
export function useApiQuery<TData, TError = AxiosError>(
  key: string | unknown[],
  url: string,
  options?: Omit<UseQueryOptions<TData, TError, TData, unknown[]>, 'queryKey' | 'queryFn'>
) {
  const queryKey = Array.isArray(key) ? key : [key]

  return useQuery({
    queryKey,
    queryFn: () => api.get<TData>(url),
    ...options,
  })
}

// Generic mutation hook
export function useApiMutation<TData, TVariables = void, TError = AxiosError>(
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: TVariables) => {
      switch (method) {
        case 'post':
          return api.post<TData>(url, variables)
        case 'put':
          return api.put<TData>(url, variables)
        case 'patch':
          return api.patch<TData>(url, variables)
        case 'delete':
          return api.delete<TData>(url)
        default:
          return api.post<TData>(url, variables)
      }
    },
    ...options,
  })
}

// Hook with automatic cache invalidation
export function useApiMutationWithInvalidation<TData, TVariables = void, TError = AxiosError>(
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  invalidateKeys: string | string[],
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  const queryClient = useQueryClient()
  const keysToInvalidate = Array.isArray(invalidateKeys) ? invalidateKeys : [invalidateKeys]

  return useMutation({
    mutationFn: (variables: TVariables) => {
      switch (method) {
        case 'post':
          return api.post<TData>(url, variables)
        case 'put':
          return api.put<TData>(url, variables)
        case 'patch':
          return api.patch<TData>(url, variables)
        case 'delete':
          return api.delete<TData>(url)
        default:
          return api.post<TData>(url, variables)
      }
    },
    onSuccess: (...args) => {
      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

// Hook for paginated queries
export function usePaginatedQuery<TData extends { data: unknown[]; total: number }>(
  key: string,
  url: string,
  page: number,
  limit: number,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  const queryKey = [key, page, limit]
  const queryUrl = `${url}?page=${page}&limit=${limit}`

  return useQuery({
    queryKey,
    queryFn: () => api.get<TData>(queryUrl),
    ...options,
  })
}
