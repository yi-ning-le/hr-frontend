// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores/useAuthStore";
import { Header } from "../Header";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Mock @tanstack/react-router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
}));

// Mock useAuthStore
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(() => ({
    user: { username: "Admin", email: "admin@example.com", avatar: "" },
    logout: vi.fn(),
  })),
}));

// Mock useUserRole
vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: vi.fn(),
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserRole } from "@/hooks/useUserRole";

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("Header Navigation", () => {
  it("shows Pending Resumes link for interviewers", async () => {
    // Mock user
    vi.mocked(useAuthStore).mockImplementation(
      () =>
        ({
          user: {
            username: "Interviewer",
            email: "int@example.com",
            avatar: "",
          },
          logout: vi.fn(),
        }) as any,
    );

    // Mock roles
    vi.mocked(useUserRole).mockReturnValue({
      isInterviewer: true,
      isAdmin: false,
      isRecruiter: false,
      isHR: false,
    } as any);

    renderWithProviders(<Header />);
    const link = screen.getByRole("link", { name: /pending resumes/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/pending-resumes");
  });

  it("does not show Pending Resumes link for non-interviewers", async () => {
    // Mock user
    vi.mocked(useAuthStore).mockImplementation(
      () =>
        ({
          user: { username: "User", email: "user@example.com", avatar: "" },
          logout: vi.fn(),
        }) as any,
    );

    // Mock roles
    vi.mocked(useUserRole).mockReturnValue({
      isInterviewer: false,
      isAdmin: false,
      isRecruiter: false,
      isHR: false,
    } as any);

    renderWithProviders(<Header />);
    const link = screen.queryByRole("link", { name: /pending resumes/i });
    expect(link).not.toBeInTheDocument();
  });

  it("contains a link to the settings page in the dropdown menu", async () => {
    const user = userEvent.setup();
    // Default mock behavior
    // Default mock behavior
    vi.mocked(useAuthStore).mockImplementation(
      () =>
        ({
          user: { username: "Admin", email: "admin@example.com", avatar: "" },
          logout: vi.fn(),
        }) as any,
    );

    vi.mocked(useUserRole).mockReturnValue({
      isInterviewer: false,
      isAdmin: false,
      isRecruiter: false,
      isHR: false,
    } as any);

    renderWithProviders(<Header />);

    // Open the dropdown by clicking the avatar/button
    const avatarButton = screen.getByRole("button", { name: /admin/i });
    await user.click(avatarButton);

    // Check if the Settings link is present and points to the correct route
    const settingsLink = screen.getByRole("link", { name: /settings/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", "/settings");
  });
});
