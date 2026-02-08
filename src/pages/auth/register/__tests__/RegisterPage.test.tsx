import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RegisterPage } from "../RegisterPage";

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
vi.mock("../RegisterForm", () => ({
  RegisterForm: () => <div data-testid="register-form">RegisterForm</div>,
}));

describe("RegisterPage", () => {
  it("renders create account title", () => {
    render(<RegisterPage />);

    expect(screen.getByText("auth.register.createAccount")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<RegisterPage />);

    expect(screen.getByText("auth.register.subtitle")).toBeInTheDocument();
  });

  it("renders RegisterForm component", () => {
    render(<RegisterPage />);

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("renders login link", () => {
    render(<RegisterPage />);

    expect(screen.getByText("auth.register.hasAccount")).toBeInTheDocument();
    expect(screen.getByText("auth.register.login")).toBeInTheDocument();
  });

  it("renders terms and privacy links", () => {
    render(<RegisterPage />);

    // Use partial matching or check for existence without strict equality due to potential whitespace or splitting
    expect(screen.getByText(/auth.register.termsPrefix/)).toBeInTheDocument();
    expect(
      screen.getByText("auth.register.termsOfService"),
    ).toBeInTheDocument();
    expect(screen.getByText(/auth.register.and/)).toBeInTheDocument();
    expect(screen.getByText("auth.register.privacyPolicy")).toBeInTheDocument();
  });
});
