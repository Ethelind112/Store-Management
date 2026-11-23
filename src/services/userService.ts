import { apiClient } from './api';
import { PaginationResponse, Response } from '../types/response';
import { GetUsersParams, RegisterRequest, User } from '../types/auth';
import { authService } from './authService';

export const userService = {
  /**
   * Fetch all users with pagination and search (super admin only)
   */
  getUsers: async (params?: GetUsersParams): Promise<PaginationResponse<User[]>> => {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.set('page', String(params.page));
    }

    if (params?.per_page !== undefined) {
      searchParams.set('per_page', String(params.per_page));
    }

    if (params?.name !== undefined && params.name.trim() !== '') {
      searchParams.set('name', String(params.name.trim()));
    }

    const query = searchParams.toString();
    const endpoint = query ? `users?${query}` : 'users';

    return apiClient<PaginationResponse<User[]>>(endpoint);
  },

  /**
   * Create a new user (super admin / admin)
   */
  createUser: async (data: RegisterRequest): Promise<Response<unknown>> => {
    return authService.register(data);
  },

  /**
   * Delete a user by ID
   * NOTE: Endpoint not ready yet — placeholder only.
   */
  deleteUser: async (_id: string): Promise<Response<unknown>> => {
    return apiClient<Response<unknown>>(`users/${_id}`, {
      method: 'DELETE',
    });
  },
};
