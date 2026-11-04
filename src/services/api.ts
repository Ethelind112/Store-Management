// src/services/api.ts
const BASE_URL = 'http://localhost:8080';

interface RequestOptions extends RequestInit {
  data?: unknown;
  headers?: Record<string, string>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers: customHeaders, ...customConfig } = options;

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...(customHeaders || {}),
    },
    ...customConfig,
  };

  const response = await fetch(`${BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as { message?: string }).message || `HTTP error! Status: ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as unknown as T;
}