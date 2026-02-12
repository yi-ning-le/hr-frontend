import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HRManagement } from "../HRManagement";

// Mock dependencies
vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  RecruitmentAPI: {
    getHRs: vi.fn(),
  },
  EmployeesAPI: {
    list: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

import { useUserRole } from "@/hooks/useUserRole";
import { EmployeesAPI, RecruitmentAPI } from "@/lib/api";

const mockUseUserRole = vi.mocked(useUserRole);
const mockGetHRs = vi.mocked(RecruitmentAPI.getHRs);
const mockListEmployees = vi.mocked(EmployeesAPI.list);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("HRManagement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListEmployees.mockResolvedValue({
      employees: [],
      total: 0,
      page: 1,
      limit: 100,
    });
  });

  it("shows loading state when role is loading", () => {
    mockUseUserRole.mockReturnValue({
      isAdmin: false,
      isRecruiter: false,
      isInterviewer: false,
      isHR: false,
      canReviewResumes: false,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { container } = render(<HRManagement />, {
      wrapper: createWrapper(),
    });
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("shows admin-only message for non-admin users", () => {
    mockUseUserRole.mockReturnValue({
      isAdmin: false,
      isRecruiter: false,
      isInterviewer: false,
      isHR: false,
      canReviewResumes: false,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<HRManagement />, { wrapper: createWrapper() });
    expect(
      screen.getByText("Admin access required to manage HR employees."),
    ).toBeInTheDocument();
  });

  it("shows HR management interface for admin users", async () => {
    mockUseUserRole.mockReturnValue({
      isAdmin: true,
      isRecruiter: false,
      isInterviewer: false,
      isHR: false,
      canReviewResumes: true,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockGetHRs.mockResolvedValue([]);

    render(<HRManagement />, { wrapper: createWrapper() });
    expect(screen.getByText("HR Management")).toBeInTheDocument();
    expect(screen.getByText("Add HR")).toBeInTheDocument();
  });

  it("displays HRs when data is available", async () => {
    mockUseUserRole.mockReturnValue({
      isAdmin: true,
      isRecruiter: false,
      isInterviewer: false,
      isHR: false,
      canReviewResumes: true,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockGetHRs.mockResolvedValue([
      {
        employeeId: "1",
        firstName: "Jane",
        lastName: "HR",
        department: "Human Resources",
      },
    ]);

    render(<HRManagement />, { wrapper: createWrapper() });

    await vi.waitFor(() => {
      expect(screen.getByText("Jane HR")).toBeInTheDocument();
    });
  });
});
