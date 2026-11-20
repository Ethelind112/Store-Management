// src/services/userService.js
import { Category } from '../types/category';
import { Response } from '../types/response';
import { apiClient } from './api';

export const categoryService = {
  // getAll: (page: number) => apiClient<Category[]>('categories', {data: {page: page}}),
  // Get all users
  getAll: () => apiClient<Response<Category[]>>('categories'),

  // Get a single user by ID
//   getById: (id) => apiClient(`users/${id}`),

//   // Create a new user (POST request)
//   create: (userData) => apiClient('users', { data: userData }),

//   // Update a user (PUT/PATCH request)
//   update: (id, userData) => apiClient(`users/${id}`, { method: 'PUT', data: userData }),
};