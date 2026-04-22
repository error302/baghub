import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import type { User, AuthResponse } from '@/types'

interface LoginCredentials {
  email: string;
  password: string;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const hasToken = api.loadToken()
      if (!hasToken) {
        setIsLoading(false)
        return false
      }

      // Verify token by fetching current user
      const userData = await api.get<User>('/auth/me')
      setUser(userData)
      setIsLoading(false)
      return true
    } catch (error) {
      api.clearToken()
      setUser(null)
      setIsLoading(false)
      return false
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      api.setToken(response.token)
      setUser(response.user)
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    api.clearToken()
    setUser(null)
    navigate('/login')
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  }
}
