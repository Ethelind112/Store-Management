// src/services/userService.js
import { Category } from '../types/category';
import { apiClient } from './api';

export const categoryService = {
  // Get all users
  getAll: () => apiClient<Category[]>('categories'),

  // Get a single user by ID
//   getById: (id) => apiClient(`users/${id}`),

//   // Create a new user (POST request)
//   create: (userData) => apiClient('users', { data: userData }),

//   // Update a user (PUT/PATCH request)
//   update: (id, userData) => apiClient(`users/${id}`, { method: 'PUT', data: userData }),
};