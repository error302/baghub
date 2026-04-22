"use client";

import { useEffect, useCallback, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const user = session?.user as User | undefined;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setError(null);
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: credentials.email,
          password: credentials.password,
        });

        if (result?.error) {
          setError(result.error);
          return { success: false, error: result.error };
        }

        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        return { success: false, error: message };
      }
    },
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut({ redirect: false });
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(
    async (userData: {
      name: string;
      email: string;
      password: string;
    }) => {
      setError(null);
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Registration failed");
          return { success: false, error: data.message };
        }

        // Auto-login after registration
        return await login({
          email: userData.email,
          password: userData.password,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setError(message);
        return { success: false, error: message };
      }
    },
    [login]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
  };
}

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true);
      // Redirect to login page
      window.location.href = `/login?callbackUrl=${encodeURIComponent(
        window.location.pathname
      )}`;
    }
  }, [status]);

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || isRedirecting,
  };
}
