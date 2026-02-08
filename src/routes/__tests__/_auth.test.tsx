import { redirect } from "@tanstack/react-router";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores/useAuthStore";
import { Route } from "../_auth";

// Mock dependencies
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...(actual as Record<string, unknown>),
    createRoute: <T,>(options: T) => options,
    redirect: vi.fn(),
  };
});

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

// Define a type for the mocked route options
interface RouteOptions {
  beforeLoad?: (args: Record<string, unknown>) => void;
}

describe("Auth Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to home if user is authenticated", () => {
    // Setup authenticated state
    (useAuthStore.getState as Mock).mockReturnValue({ isAuthenticated: true });

    // Execute beforeLoad
    try {
      (Route as RouteOptions).beforeLoad!({} as Record<string, unknown>);
    } catch {
      // redirect is thrown
    }

    // Verify redirect was called with correct params
    expect(redirect).toHaveBeenCalledWith({ to: "/" });
  });

  it("should not redirect if user is not authenticated", () => {
    // Setup unauthenticated state
    (useAuthStore.getState as Mock).mockReturnValue({ isAuthenticated: false });

    // Execute beforeLoad
    (Route as RouteOptions).beforeLoad!({} as Record<string, unknown>);

    // Verify redirect was NOT called
    expect(redirect).not.toHaveBeenCalled();
  });
});
