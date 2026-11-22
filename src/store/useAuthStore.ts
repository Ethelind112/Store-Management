import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LoginRequest, RegisterRequest, User } from '../types/auth';
import {
  authService,
  extractUserFromToken,
  isTokenValid,
} from '../services/authService';

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkTokenValidity: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        const response = await authService.login(credentials);
        const receivedToken = response?.data?.token;

        if (!receivedToken) {
          throw new Error('Token otentikasi tidak ditemukan dalam respon server.');
        }

        const decodedUser = extractUserFromToken(receivedToken);

        set({
          token: receivedToken,
          user: decodedUser,
          isAuthenticated: Boolean(decodedUser),
          isLoading: false,
        });
      },

      register: async (data: RegisterRequest) => {
        await authService.register(data);
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkTokenValidity: () => {
        const { token } = get();
        if (token && !isTokenValid(token)) {
          get().logout();
        }
      },
    }),
    {
      name: 'bright_print_auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token && isTokenValid(state.token)) {
            state.user = extractUserFromToken(state.token);
            state.isAuthenticated = true;
          } else {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);

// Convenient alias
export const useAuth = useAuthStore;
