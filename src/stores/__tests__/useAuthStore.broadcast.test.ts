import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock i18n to prevent re-initialization warnings
vi.mock("@/lib/i18n", () => ({
  default: {
    language: "zh-CN",
    changeLanguage: vi.fn(),
  },
}));

const apiMocks = vi.hoisted(() => {
  let unauthorizedCallback: (() => void) | null = null;
  let authChangeCallback:
    | ((auth: { token: string | null; sessionId: string | null }) => void)
    | null = null;

  return {
    AuthAPI: {
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    },
    setAuthToken: vi.fn(),
    setSessionId: vi.fn(),
    setUnauthorizedCallback: vi.fn((callback: () => void) => {
      unauthorizedCallback = callback;
    }),
    onAuthChange: vi.fn(
      (
        callback: (auth: {
          token: string | null;
          sessionId: string | null;
        }) => void,
      ) => {
        authChangeCallback = callback;
      },
    ),
    triggerUnauthorized: () => {
      unauthorizedCallback?.();
    },
    triggerAuthChange: (auth: {
      token: string | null;
      sessionId: string | null;
    }) => {
      authChangeCallback?.(auth);
    },
    resetCallbacks: () => {
      unauthorizedCallback = null;
      authChangeCallback = null;
    },
  };
});

vi.mock("@/lib/api", () => ({
  AuthAPI: apiMocks.AuthAPI,
  setAuthToken: apiMocks.setAuthToken,
  setSessionId: apiMocks.setSessionId,
  setUnauthorizedCallback: apiMocks.setUnauthorizedCallback,
  onAuthChange: apiMocks.onAuthChange,
}));

describe("useAuthStore auth callbacks", () => {
  let useAuthStore: typeof import("../useAuthStore").useAuthStore;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    apiMocks.resetCallbacks();
    sessionStorage.clear();

    const module = await import("../useAuthStore");
    useAuthStore = module.useAuthStore;

    useAuthStore.setState({
      user: null,
      token: null,
      sessionId: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("registers unauthorized and auth-change callbacks", () => {
    expect(apiMocks.setUnauthorizedCallback).toHaveBeenCalledTimes(1);
    expect(apiMocks.onAuthChange).toHaveBeenCalledTimes(1);
  });

  it("resets store when unauthorized callback is triggered", () => {
    useAuthStore.setState({
      user: { id: "user-1", username: "test", createdAt: "" },
      token: "token-1",
      sessionId: "session-1",
      isAuthenticated: true,
      isLoading: false,
    });

    apiMocks.triggerUnauthorized();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.sessionId).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("syncs in-memory auth state from auth-change callback", () => {
    useAuthStore.setState({
      user: { id: "user-1", username: "test", createdAt: "" },
      token: "old-token",
      sessionId: "old-session",
      isAuthenticated: true,
      isLoading: false,
    });

    apiMocks.triggerAuthChange({
      token: "new-token",
      sessionId: "new-session",
    });

    const state = useAuthStore.getState();
    expect(state.user?.id).toBe("user-1");
    expect(state.token).toBe("new-token");
    expect(state.sessionId).toBe("new-session");
    expect(state.isAuthenticated).toBe(true);

    const savedState = JSON.parse(
      sessionStorage.getItem("hr_auth_state") ?? "{}",
    ) as { token?: string; sessionId?: string };
    expect(savedState.token).toBe("new-token");
    expect(savedState.sessionId).toBe("new-session");
  });
});
