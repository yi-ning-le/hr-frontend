import { isAxiosError } from "axios";
import { create } from "zustand";
import { AuthAPI, setAuthToken } from "@/lib/api";
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

const getTabId = (): string => {
  let tabId = sessionStorage.getItem("tabId");
  if (!tabId) {
    tabId = crypto.randomUUID();
    sessionStorage.setItem("tabId", tabId);
  }
  return tabId;
};

const getStorageKey = (): string => {
  return `auth-tab-${getTabId()}`;
};

const loadFromStorage = (): Partial<AuthState> => {
  try {
    const stored = sessionStorage.getItem(getStorageKey());
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user,
        token: parsed.token,
        sessionId: parsed.sessionId,
        isAuthenticated: parsed.isAuthenticated,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return {};
};

const saveToStorage = (state: Partial<AuthState>): void => {
  try {
    sessionStorage.setItem(
      getStorageKey(),
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

const authChannel = new BroadcastChannel("auth-sync");

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAuthStore = create<AuthStore>()((set, get) => {
  const initialState = loadFromStorage();

  if (initialState.token) {
    setAuthToken(initialState.token);
  }

  authChannel.onmessage = (event) => {
    const { type, tabId: senderTabId } = event.data;
    const currentTabId = getTabId();

    if (senderTabId === currentTabId) {
      return;
    }

    if (type === "LOGIN") {
      const stored = loadFromStorage();
      if (stored.token && stored.token !== initialState.token) {
        setAuthToken(stored.token);
        set({
          user: stored.user || null,
          token: stored.token,
          sessionId: stored.sessionId || null,
          isAuthenticated: stored.isAuthenticated || false,
        });
      }
    } else if (type === "LOGOUT") {
      queryClient.clear();
      setAuthToken(null);
      sessionStorage.removeItem(getStorageKey());
      set({
        user: null,
        token: null,
        sessionId: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return {
    user: initialState.user || null,
    token: initialState.token || null,
    sessionId: initialState.sessionId || null,
    isAuthenticated: initialState.isAuthenticated || false,
    isLoading: false,

    reset: () => {
      queryClient.clear();
      setAuthToken(null);
      sessionStorage.removeItem(getStorageKey());
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

        authChannel.postMessage({
          type: "LOGIN",
          tabId: getTabId(),
        });

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

        authChannel.postMessage({
          type: "LOGOUT",
          tabId: getTabId(),
        });

        return { success: true };
      } catch (error) {
        get().reset();
        console.error("Logout API call failed:", error);

        let errorMessage = i18n.t("header.logoutFailed");
        if (isAxiosError(error)) {
          errorMessage =
            error.response?.data?.message ||
            `${i18n.t("header.logoutFailed")}: ${error.response?.status || "Unknown error"}`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

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
