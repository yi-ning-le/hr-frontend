import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterForm } from "../RegisterForm";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock @tanstack/react-router
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  useRouter: () => ({
    invalidate: vi.fn(),
  }),
}));

// Mock useAuthStore
const mockRegister = vi.fn();
vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    register: mockRegister,
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

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders registration form with all fields", () => {
    render(<RegisterForm />);

    expect(screen.getByText("auth.register.username")).toBeInTheDocument();
    expect(screen.getByText("auth.register.email")).toBeInTheDocument();
    expect(screen.getByText("auth.register.password")).toBeInTheDocument();
    expect(screen.getByText("auth.register.confirmPassword")).toBeInTheDocument();
  });

  it("renders all input placeholders", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("auth.register.usernamePlaceholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("auth.register.emailPlaceholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("auth.register.passwordPlaceholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("auth.register.confirmPasswordPlaceholder")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("button", { name: "auth.register.submit" })).toBeInTheDocument();
  });

  it("toggles password visibility for password field", () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByPlaceholderText("auth.register.passwordPlaceholder");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find the toggle buttons (there are 2: password and confirm password)
    const toggleButtons = screen.getAllByRole("button", { name: "auth.login.showPassword" });
    fireEvent.click(toggleButtons[0]);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("toggles password visibility for confirm password field", () => {
    render(<RegisterForm />);

    const confirmPasswordInput = screen.getByPlaceholderText("auth.register.confirmPasswordPlaceholder");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    // Find the toggle buttons (second one is for confirm password)
    const toggleButtons = screen.getAllByRole("button", { name: "auth.login.showPassword" });
    fireEvent.click(toggleButtons[1]);

    expect(confirmPasswordInput).toHaveAttribute("type", "text");
  });
});
