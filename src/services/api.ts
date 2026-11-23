// src/services/api.ts
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = 'http://localhost:8080';

interface RequestOptions extends RequestInit {
  data?: unknown;
  headers?: Record<string, string>;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers: customHeaders, ...customConfig } = options;

  // Retrieve token directly from Zustand state
  const token = useAuthStore.getState().token;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      ...defaultHeaders,
      ...(customHeaders || {}),
    },
    ...customConfig,
  };

  const response = await fetch(`${BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    // If unauthorized on an authenticated endpoint (not during login), log out
    if (response.status === 401 && endpoint !== 'login') {
      useAuthStore.getState().logout();
    }

    const errorData = (await response.json().catch(() => ({}))) as ApiErrorResponse;

    let errorMessage = '';

    if (errorData.message && errorData.error) {
      errorMessage = `${errorData.message}: ${errorData.error}`;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else if (response.status === 401) {
      errorMessage = 'Username atau password salah (401 Unauthorized).';
    } else if (response.status === 400) {
      errorMessage = 'Permintaan tidak valid (400 Bad Request).';
    } else {
      errorMessage = `Terjadi kesalahan (Status ${response.status}).`;
    }

    throw new Error(errorMessage);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as unknown as T;
}
