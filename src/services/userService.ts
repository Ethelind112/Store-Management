import { apiClient } from './api';
import { Response } from '../types/response';
import { User } from '../types/auth';

export const userService = {
  /**
   * Fetch all users (super admin only)
   */
  getUsers: async (): Promise<Response<User[]>> => {
    return apiClient<Response<User[]>>('users', {
      method: 'GET',
    });
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
