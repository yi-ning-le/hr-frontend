import { describe, expect, it, vi } from "vitest";
import { Route } from "../_protected/pending-resumes";
import { queryClient } from "@/lib/queryClient";

// Mock queryClient
vi.mock("@/lib/queryClient", () => ({
  queryClient: {
    ensureQueryData: vi.fn(),
  },
}));

// Mock the parent route to avoid loading the entire route tree
vi.mock("../_protected", () => ({
  Route: {},
}));

// Mock the page component
vi.mock("@/pages/interviews/PendingResumesPage", () => ({
  default: () => null,
}));

// Mock redirect to verify it's called
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    createRoute: (options: any) => ({ options }), // simplified for testing
  };
});

describe("pending-resumes route", () => {
  it("redirects if user is not an interviewer", async () => {
    vi.mocked(queryClient.ensureQueryData).mockResolvedValue({
      isInterviewer: false,
    } as any);

    // Assert that it rejects/throws
    await expect(Route.options.beforeLoad?.({} as any)).rejects.toMatchObject({
      options: { to: "/" },
    });
  });

  it("succeeds if user is an interviewer", async () => {
    vi.mocked(queryClient.ensureQueryData).mockResolvedValue({
      isInterviewer: true,
    } as any);

    await expect(Route.options.beforeLoad?.({} as any)).resolves.not.toThrow();
  });
});
