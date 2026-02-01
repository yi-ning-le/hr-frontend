import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    email?: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  // Reserved for future third-party login
  loginWithProvider: (
    provider: "wechat" | "dingtalk" | "feishu",
  ) => Promise<{ success: boolean; error?: string }>;
}

type AuthStore = AuthState & AuthActions;

// Simulated user database (for frontend-only testing)
const mockUsers: { username: string; password: string; user: User }[] = [
  {
    username: "admin",
    password: "admin123",
    user: {
      id: "1",
      username: "admin",
      email: "admin@example.com",
      createdAt: new Date().toISOString(),
    },
  },
];

// Simulate async delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Login action (simulated) - TEMPORARY: bypass validation for testing
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        await delay(800); // Simulate network delay

        // TODO: Re-enable validation after testing
        // const foundUser = mockUsers.find(
        //   (u) => u.username === username && u.password === password,
        // );

        // TEMPORARY: Accept any credentials for testing
        const tempUser: User = {
          id: "temp-1",
          username: username || "test_user",
          email: "test@example.com",
          createdAt: new Date().toISOString(),
        };

        set({
          user: tempUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };

        // Original validation logic (commented out for testing):
        // if (foundUser) {
        //   set({
        //     user: foundUser.user,
        //     isAuthenticated: true,
        //     isLoading: false,
        //   });
        //   return { success: true };
        // }

        // set({ isLoading: false });
        // return { success: false, error: "用户名或密码错误" };
      },

      // Register action (simulated)
      register: async (username: string, password: string, email?: string) => {
        set({ isLoading: true });
        await delay(800);

        // Check if username exists
        const exists = mockUsers.some((u) => u.username === username);
        if (exists) {
          set({ isLoading: false });
          return { success: false, error: "用户名已存在" };
        }

        // Create new user
        const newUser: User = {
          id: String(mockUsers.length + 1),
          username,
          email,
          createdAt: new Date().toISOString(),
        };

        mockUsers.push({ username, password, user: newUser });

        set({
          isLoading: false,
        });

        return { success: true };
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
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
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
