import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  AuthAPI,
  onAuthChange,
  setAuthToken,
  setSessionId,
  setUnauthorizedCallback,
} from "@/lib/api";
import i18n from "@/lib/i18n";
import { queryClient } from "@/lib/queryClient";

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

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
  reset: () => void;
  loginWithProvider: (
    provider: "wechat" | "dingtalk" | "feishu",
  ) => Promise<{ success: boolean; error?: string }>;
}

type AuthStore = AuthState & AuthActions;

const STORAGE_KEY = "hr_auth_state";

const loadFromStorage = (): Partial<AuthState> => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    // Prioritize individual keys which are updated by the API interceptor
    const token = sessionStorage.getItem("hr_auth_token");
    const sessionId = sessionStorage.getItem("hr_session_id");

    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user,
        token: token || parsed.token,
        sessionId: sessionId || parsed.sessionId,
        isAuthenticated: !!(token || parsed.token),
      };
    }

    if (token) {
      return { token, sessionId, isAuthenticated: true };
    }
  } catch {
    // Ignore parse errors
  }
  return {};
};

const saveToStorage = (state: Partial<AuthState>): void => {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        token: state.token,
        sessionId: state.sessionId,
        isAuthenticated: state.isAuthenticated,
      }),
    );
  } catch {
    // Ignore storage errors
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAuthStore = create<AuthStore>()((set, get) => {
  const initialState = loadFromStorage();

  // Register callback so api.ts can trigger a UI-level logout
  setUnauthorizedCallback(() => get().reset());

  // Subscribe to auth changes (e.g., from token refresh in api.ts)
  // to keep in-memory state synchronized and prevent "split-brain" issues.
  onAuthChange(({ token, sessionId }) => {
    const currentState = get();
    set({
      ...currentState,
      token,
      sessionId,
      isAuthenticated: !!token,
    });
    // saveToStorage is handled naturally if any other action calls set(),
    // but here we force it to ensure consistency.
    saveToStorage(get());
  });

  return {
    user: initialState.user || null,
    token: initialState.token || null,
    sessionId: initialState.sessionId || null,
    isAuthenticated: initialState.isAuthenticated || false,
    isLoading: false,

    reset: () => {
      queryClient.clear();
      setAuthToken(null);
      setSessionId(null);
      sessionStorage.removeItem(STORAGE_KEY);
      set({
        user: null,
        token: null,
        sessionId: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

    login: async (username: string, password: string) => {
      set({ isLoading: true });
      try {
        const data = await AuthAPI.login({ username, password });

        setAuthToken(data.token);
        setSessionId(data.sessionId);

        const user: User = {
          id: data.user.id,
          username: data.user.username,
          createdAt: new Date().toISOString(),
        };

        const newState = {
          user,
          token: data.token,
          sessionId: data.sessionId,
          isAuthenticated: true,
          isLoading: false,
        };

        set(newState);
        saveToStorage(newState);

        // No LOGIN broadcast to maintain tab isolation

        return { success: true };
      } catch (error) {
        set({ isLoading: false });
        let errorMessage = i18n.t("auth.login.failed");
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

    register: async (username: string, password: string, email: string) => {
      set({ isLoading: true });
      try {
        await AuthAPI.register({ username, password, email });

        set({ isLoading: false });
        return { success: true };
      } catch (error) {
        set({ isLoading: false });
        let errorMessage = i18n.t("auth.register.failed");
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

    logout: async () => {
      set({ isLoading: true });

      try {
        await AuthAPI.logout();
        get().reset();
        return { success: true };
      } catch (error) {
        console.error("Logout API call failed:", error);

        let errorMessage = i18n.t("header.logoutFailed");
        if (isAxiosError(error)) {
          errorMessage =
            error.response?.data?.message ||
            `${i18n.t("header.logoutFailed")}: ${error.response?.status || "Unknown error"}`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        get().reset();
        return {
          success: false,
          error: errorMessage,
        };
      }
    },

    loginWithProvider: async (provider) => {
      set({ isLoading: true });
      await delay(500);
      set({ isLoading: false });

      console.log(`Third-party login with ${provider} - not implemented yet`);
      return { success: false, error: i18n.t("auth.social.comingSoon") };
    },
  };
});
