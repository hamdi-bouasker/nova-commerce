export const API_BASE_URL = import.meta.env.VITE_API_URL || '/backend/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export const api = {
  get: async <T>(url: string): Promise<T> => request<T>(url, { method: 'GET' }),

  post: async <T>(url: string, data: any): Promise<T> =>
    request<T>(url, { method: 'POST', data }),

  put: async <T>(url: string, data: any): Promise<T> =>
    request<T>(url, { method: 'PUT', data }),

  delete: async <T>(url: string, data?: any): Promise<T> =>
    request<T>(url, { method: 'DELETE', data }),
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(url, config);

  // Check for empty response
  const text = await response.text();
  if (!text) {
    throw new Error(`API Error: Empty response from server (Status: ${response.status})`);
  }

  // Try to parse JSON
  let responseData;
  try {
    responseData = JSON.parse(text);
  } catch (e) {
    console.error("API Error: Expected JSON but got:", text.substring(0, 100));
    throw new Error(`API Error: Invalid JSON response (Status: ${response.status}). Response: ${text.substring(0, 50)}...`);
  }

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'API Error');
  }

  return responseData as T;
}
