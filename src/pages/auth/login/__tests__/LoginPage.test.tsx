import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LoginPage } from "../LoginPage";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock @tanstack/react-router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn(),
}));

// Mock child components
vi.mock("../LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form">LoginForm</div>,
}));

vi.mock("../SocialLoginButtons", () => ({
  SocialLoginButtons: () => <div data-testid="social-buttons">SocialLoginButtons</div>,
}));

// Mock useAuthStore
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    isLoading: false,
  }),
}));

describe("LoginPage", () => {
  it("renders welcome title", () => {
    render(<LoginPage />);

    expect(screen.getByText("auth.login.welcomeTitle")).toBeInTheDocument();
  });

  it("renders LoginForm component", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders SocialLoginButtons component", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("social-buttons")).toBeInTheDocument();
  });

  it("renders registration link", () => {
    render(<LoginPage />);

    expect(screen.getByText("auth.login.noAccount")).toBeInTheDocument();
    expect(screen.getByText("auth.login.register")).toBeInTheDocument();
  });
});
