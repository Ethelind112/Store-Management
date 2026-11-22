// src/services/api.ts
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = 'http://localhost:8080';

interface RequestOptions extends RequestInit {
  data?: unknown;
  headers?: Record<string, string>;
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
    if (response.status === 401) {
      // Clear expired / invalid token state in Zustand
      useAuthStore.getState().logout();
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as { message?: string }).message || `HTTP error! Status: ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as unknown as T;
}
