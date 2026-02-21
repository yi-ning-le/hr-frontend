// @vitest-environment jsdom
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userRoleQueryOptions } from "@/hooks/useUserRole";
import { queryClient } from "@/lib/queryClient";
import { Route as RootRoute } from "../../__root";
import { Route as ProtectedRoute } from "../../_protected";
import { Route as PendingResumesRoute } from "../pending-resumes";

// Mock window.matchMedia for Toaster/Sonner
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock dependent components
vi.mock("@/pages/interviews/PendingResumesPage", () => ({
  default: () => (
    <div data-testid="pending-resumes-page">Pending Resumes Page</div>
  ),
}));

vi.mock("@/components/layout/Header", () => ({
  Header: () => <div>Header</div>,
}));

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <div>Footer</div>,
}));

// Mock AuthStore
const mockGetState = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: {
    getState: () => mockGetState(),
  },
}));

describe("PendingResumes Route Guard", () => {
  beforeEach(() => {
    mockGetState.mockReturnValue({
      isAuthenticated: true,
    });
    // Clear query cache
    queryClient.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders page when user is interviewer", async () => {
    // Stage the query data
    queryClient.setQueryData(userRoleQueryOptions().queryKey, {
      canReviewResumes: false,
      isInterviewer: true,
      isAdmin: false,
      isRecruiter: false,
      isHR: false,
    });

    const router = createRouter({
      routeTree: RootRoute.addChildren([
        ProtectedRoute.addChildren([PendingResumesRoute]),
      ]),
      history: createMemoryHistory({
        initialEntries: ["/pending-resumes"],
      }),
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId("pending-resumes-page")).toBeInTheDocument();
    });
  });

  it("redirects to home when user is NOT interviewer or recruiter", async () => {
    // Stage the query data
    queryClient.setQueryData(userRoleQueryOptions().queryKey, {
      isInterviewer: false,
      isAdmin: false,
      isRecruiter: false,
      isHR: false,
    });

    const router = createRouter({
      routeTree: RootRoute.addChildren([
        ProtectedRoute.addChildren([PendingResumesRoute]),
      ]),
      history: createMemoryHistory({
        initialEntries: ["/pending-resumes"],
      }),
    });

    render(<RouterProvider router={router} />);

    // Should redirect to "/" (which is not in our test router, so likely ends up 404 or just not pending page)
    // But since we didn't add the index route, router logic might stall or show nothing.
    // We can check that PendingResumesPage is NOT rendered.

    await waitFor(() => {
      expect(
        screen.queryByTestId("pending-resumes-page"),
      ).not.toBeInTheDocument();
    });

    // To be more precise we could verify the redirect location, but checking access denial is sufficient for this unit test.
    expect(router.history.location.pathname).toBe("/");
  });
});
