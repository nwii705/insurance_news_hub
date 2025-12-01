/**
 * API client utilities for fetching data from backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_V1_PREFIX = process.env.NEXT_PUBLIC_API_V1_PREFIX || '/api/v1';

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${API_V1_PREFIX}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_URL}${API_V1_PREFIX}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },
};

// Article API
export const articlesApi = {
  getAll: (params?: { page?: number; category_id?: string; search?: string }) => {
    const queryString = new URLSearchParams(params as any).toString();
    return apiClient.get<any>(`/articles?${queryString}`);
  },

  getBySlug: (slug: string) => {
    return apiClient.get<any>(`/articles/${slug}`);
  },

  getFeatured: () => {
    return apiClient.get<any[]>('/articles/featured/list');
  },

  getTrending: () => {
    return apiClient.get<any[]>('/articles/trending/list');
  },
};

// Legal Docs API
export const legalDocsApi = {
  getAll: (params?: { page?: number; category_id?: string; year?: number }) => {
    const queryString = new URLSearchParams(params as any).toString();
    return apiClient.get<any>(`/legal-docs?${queryString}`);
  },

  getByDocNumber: (docNumber: string) => {
    return apiClient.get<any>(`/legal-docs/doc-number/${docNumber}`);
  },

  getRecent: () => {
    return apiClient.get<any[]>('/legal-docs/recent/list');
  },
};

// Categories API
export const categoriesApi = {
  getAll: () => {
    return apiClient.get<any[]>('/categories');
  },

  getBySlug: (slug: string) => {
    return apiClient.get<any>(`/categories/${slug}`);
  },
};

// Companies API
export const companiesApi = {
  getAll: (params?: { page?: number; type?: string }) => {
    const queryString = new URLSearchParams(params as any).toString();
    return apiClient.get<any>(`/companies?${queryString}`);
  },

  getBySlug: (slug: string) => {
    return apiClient.get<any>(`/companies/${slug}`);
  },
};
