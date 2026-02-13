import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthAPI, setAuthToken } from "@/lib/api";
import { useAuthStore } from "../useAuthStore";

// Mock API
vi.mock("@/lib/api", () => ({
  AuthAPI: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
  setAuthToken: vi.fn(),
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Clear localStorage
    localStorage.clear();
    // Clear mocks
    vi.clearAllMocks();
  });

  it("should have initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  describe("login", () => {
    it("should handle successful login", async () => {
      const mockUser = { id: "1", username: "testuser" };
      const mockResponse = {
        token: "fake-token",
        sessionId: "test-session-id",
        user: mockUser,
      };

      vi.mocked(AuthAPI.login).mockResolvedValue(mockResponse);

      const result = await useAuthStore
        .getState()
        .login("testuser", "password");

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().token).toBe("fake-token");
      expect(useAuthStore.getState().user).toEqual(
        expect.objectContaining({
          id: "1",
          username: "testuser",
        }),
      );
      expect(setAuthToken).toHaveBeenCalledWith("fake-token");
    });

    it("should handle login failure", async () => {
      const errorMessage = "Invalid credentials";
      vi.mocked(AuthAPI.login).mockRejectedValue(new Error(errorMessage));

      const result = await useAuthStore
        .getState()
        .login("testuser", "wrongpass");

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().token).toBeNull();
      expect(setAuthToken).not.toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should clear all auth state", () => {
      // Setup logged in state
      useAuthStore.setState({
        user: { id: "1", username: "test", createdAt: "" },
        token: "token",
        isAuthenticated: true,
        isLoading: true,
      });

      useAuthStore.getState().reset();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(setAuthToken).toHaveBeenCalledWith(null);
    });
  });

  describe("logout", () => {
    it("should handle successful logout", async () => {
      // Setup logged in state
      useAuthStore.setState({
        user: { id: "1", username: "test", createdAt: "" },
        token: "token",
        isAuthenticated: true,
      });

      vi.mocked(AuthAPI.logout).mockResolvedValue(undefined);

      const result = await useAuthStore.getState().logout();

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
      expect(setAuthToken).toHaveBeenCalledWith(null);
    });

    it("should clear local state even when API call fails", async () => {
      // Setup logged in state
      useAuthStore.setState({
        user: { id: "1", username: "test", createdAt: "" },
        token: "token",
        isAuthenticated: true,
      });

      vi.mocked(AuthAPI.logout).mockRejectedValue(new Error("Network error"));

      const result = await useAuthStore.getState().logout();

      // Even though API failed, local state should be cleared
      expect(result.success).toBe(false);
      expect(result.error).toContain("Network error");
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
      expect(setAuthToken).toHaveBeenCalledWith(null);
    });
  });

  describe("register", () => {
    it("should handle successful registration", async () => {
      vi.mocked(AuthAPI.register).mockResolvedValue({
        id: "1",
        username: "newuser",
        email: "email@test.com",
      });

      const result = await useAuthStore
        .getState()
        .register("newuser", "pass", "email@test.com");

      expect(result.success).toBe(true);
      expect(useAuthStore.getState().isLoading).toBe(false);
      // Registration usually doesn't auto-login in this store based on code
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
