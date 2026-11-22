import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
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
  rememberMe: boolean;
  login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkTokenValidity: () => void;
}

/**
 * Custom StateStorage that switches dynamically between localStorage and sessionStorage
 * based on whether the user opted to "Remember Me" (Ingat Sesi Saya).
 */
const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name) || sessionStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value);
      const isRemembered = parsed?.state?.rememberMe ?? true;

      if (isRemembered) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      }
    } catch {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: true,

      login: async (credentials: LoginRequest, rememberMe: boolean = true) => {
        const response = await authService.login(credentials);
        const receivedToken = response?.data?.token;

        if (!receivedToken) {
          throw new Error('Token otentikasi tidak ditemukan dalam respon server.');
        }

        const decodedUser = extractUserFromToken(receivedToken);

        // Manage remembered username for quick pre-fill
        try {
          if (rememberMe) {
            localStorage.setItem('bright_print_remembered_username', credentials.username.trim());
          } else {
            localStorage.removeItem('bright_print_remembered_username');
          }
        } catch {
          // ignore storage quota errors
        }

        set({
          token: receivedToken,
          user: decodedUser,
          isAuthenticated: Boolean(decodedUser),
          isLoading: false,
          rememberMe,
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
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
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
