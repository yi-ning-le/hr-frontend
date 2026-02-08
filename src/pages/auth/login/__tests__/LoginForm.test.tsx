import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "../LoginForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
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
const mockLogin = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    login: mockLogin,
    isLoading: false,
  }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form with username and password fields", () => {
    render(<LoginForm />);

    expect(screen.getByText("auth.login.username")).toBeInTheDocument();
    expect(screen.getByText("auth.login.password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("auth.login.usernamePlaceholder"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("auth.login.passwordPlaceholder"),
    ).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("button", { name: "auth.login.submit" }),
    ).toBeInTheDocument();
  });

  it("renders forgot password link", () => {
    render(<LoginForm />);

    expect(screen.getByText("auth.login.forgotPassword")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText(
      "auth.login.passwordPlaceholder",
    );
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find the toggle button by its sr-only text
    const toggleButton = screen.getByRole("button", {
      name: "auth.login.showPassword",
    });
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("shows validation error when submitting empty form", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", {
      name: "auth.login.submit",
    });
    fireEvent.click(submitButton);

    // Wait for validation messages to appear
    await screen.findByText("auth.login.usernameRequired");
    expect(screen.getByText("auth.login.passwordRequired")).toBeInTheDocument();
  });
});
