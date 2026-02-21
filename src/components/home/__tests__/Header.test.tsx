import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/Header";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock react-router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn(),
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    user: {
      username: "管理员",
      email: "admin@example.com",
      avatar: "https://github.com/shadcn.png",
    },
    logout: vi.fn(),
  }),
}));

vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: vi.fn(() => ({
    isInterviewer: false,
    isAdmin: false,
    isRecruiter: false,
    isHR: false,
  })),
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsAPI } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  NotificationsAPI: {
    getUnreadCount: vi.fn(),
    getNotifications: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function renderHeader() {
  return render(
    <QueryClientProvider client={queryClient}>
      <Header />
    </QueryClientProvider>,
  );
}

describe("Header", () => {
  it("renders the HR System title", () => {
    renderHeader();

    expect(screen.getByText("common.appName")).toBeInTheDocument();
    expect(screen.getByText("common.appSubtitle")).toBeInTheDocument();
  });

  it("renders the notification bell with badge", async () => {
    vi.mocked(NotificationsAPI.getUnreadCount).mockResolvedValue(3);
    renderHeader();

    // The badge shows "3" notifications
    expect(await screen.findByText("3")).toBeInTheDocument();
  });

  it("renders the user avatar with fallback", () => {
    renderHeader();

    expect(screen.getByText("管理")).toBeInTheDocument();
  });

  it("does not render the LanguageSwitcher (moved to Footer)", () => {
    renderHeader();

    // LanguageSwitcher should NOT be in Header anymore
    expect(screen.queryByText("Switch language")).not.toBeInTheDocument();
  });
});
