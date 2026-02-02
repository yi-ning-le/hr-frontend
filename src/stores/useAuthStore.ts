import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isAxiosError } from "axios";
import { AuthAPI, setAuthToken } from "@/lib/api";

// User type definition
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: string;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth actions interface
interface AuthActions {
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    password: string,
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  // Reserved for future third-party login
  loginWithProvider: (
    provider: "wechat" | "dingtalk" | "feishu",
  ) => Promise<{ success: boolean; error?: string }>;
}

type AuthStore = AuthState & AuthActions;

// Simulate async delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login action
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const data = await AuthAPI.login({ username, password });

          // Set token in api module
          setAuthToken(data.token);

          // Map backend user to frontend User type if needed
          // Assuming backend returns a compatible user object or we map it
          const user: User = {
            id: data.user.id,
            username: data.user.username,
            createdAt: new Date().toISOString(), // or data.user.createdAt
          };

          set({
            user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          let errorMessage = "Login failed";
          if (isAxiosError(error) && error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          return {
            success: false,
            error: errorMessage,
          };
        }
      },

      // Register action
      register: async (username: string, password: string, email: string) => {
        set({ isLoading: true });
        try {
          await AuthAPI.register({ username, password, email });

          // Registration successful - user needs to login separately
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          let errorMessage = "Registration failed";
          if (isAxiosError(error) && error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          return {
            success: false,
            error: errorMessage,
          };
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });
        try {
          await AuthAPI.logout();
          // Only clear state if API call succeeds
          setAuthToken(null);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          console.error("Logout API call failed:", error);

          let errorMessage = "Logout failed";
          if (isAxiosError(error)) {
            errorMessage =
              error.response?.data?.message ||
              `Logout failed: ${error.response?.status || "Unknown error"}`;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          return {
            success: false,
            error: errorMessage,
          };
        }
      },

      // Third-party login placeholder
      loginWithProvider: async (provider) => {
        set({ isLoading: true });
        await delay(500);
        set({ isLoading: false });

        // TODO: Implement third-party OAuth flow
        console.log(`Third-party login with ${provider} - not implemented yet`);
        return { success: false, error: `${provider} 登录暂未开放` };
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    },
  ),
);
