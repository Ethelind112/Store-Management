// src/services/userService.js
import { GetProductsParams, Product } from '../types/product';
import { PaginationResponse } from '../types/response';
import { apiClient } from './api';

export const productService = {
  // getAll: (page: number) => apiClient<Product[]>('products', {data: {page: page}}),
  // Get all products
  getAll: (params?: GetProductsParams) => {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }

    if (params?.per_page !== undefined) {
      searchParams.set('per_page', String(params.per_page));
    }

    if (params?.category !== undefined && params.category !== '') {
      searchParams.set('category', String(params.category));
    }

    if (params?.name !== undefined && params.name.trim() !== '') {
      searchParams.set('name', String(params.name.trim()));
    }

    if (params?.min_price !== undefined && !isNaN(params.min_price)) {
      searchParams.set('min_price', String(params.min_price));
    }

    if (params?.max_price !== undefined && !isNaN(params.max_price)) {
      searchParams.set('max_price', String(params.max_price));
    }

    if (params?.sort_by) {
      searchParams.set('sort_by', params.sort_by);
    }

    if (params?.order) {
      searchParams.set('order', params.order);
    }

    const query = searchParams.toString();
    const endpoint = query ? `products?${query}` : 'products';

    return apiClient<PaginationResponse<Product[]>>(endpoint);
  },

  // Get a single user by ID
//   getById: (id) => apiClient(`users/${id}`),

//   // Create a new user (POST request)
//   create: (userData) => apiClient('users', { data: userData }),

//   // Update a user (PUT/PATCH request)
//   update: (id, userData) => apiClient(`users/${id}`, { method: 'PUT', data: userData }),
};