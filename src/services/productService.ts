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

    if (params?.categoryId !== undefined && params.categoryId !== '') {
      searchParams.set('categoryId', String(params.categoryId));
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