import { Header } from "@/components/layout/Header";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'zh-CN', changeLanguage: vi.fn() },
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
      avatar: "https://github.com/shadcn.png"
    },
    logout: vi.fn(),
  }),
}));

function renderHeader() {
  return render(<Header />);
}

describe("Header", () => {
  it("renders the HR System title", () => {
    renderHeader();

    expect(screen.getByText("common.appName")).toBeInTheDocument();
    expect(screen.getByText("common.appSubtitle")).toBeInTheDocument();
  });

  it("renders the notification bell with badge", () => {
    renderHeader();

    // The badge shows "3" notifications
    expect(screen.getByText("3")).toBeInTheDocument();
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
