// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores/useAuthStore";
import { AdminHeader } from "../AdminHeader";

const mockNavigate = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("AdminHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders admin brand and current user", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: "Alice", email: "alice@example.com", avatar: "" },
      logout: vi.fn(),
    } as any);

    const user = userEvent.setup();
    render(<AdminHeader />);

    expect(screen.getByText("admin.console")).toBeInTheDocument();
    expect(screen.getByText("admin.management")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Alice" }));
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("logs out successfully and navigates to login", async () => {
    const user = userEvent.setup();
    const logout = vi.fn().mockResolvedValue({ success: true });

    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: "Admin", email: "admin@example.com", avatar: "" },
      logout,
    } as any);

    render(<AdminHeader />);

    await user.click(screen.getByRole("button", { name: "Admin" }));
    await user.click(screen.getByText("header.logout"));

    expect(logout).toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith("header.logoutSuccess");
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
  });

  it("shows error toast when logout fails", async () => {
    const user = userEvent.setup();
    const logout = vi.fn().mockResolvedValue({ success: false, error: "boom" });

    vi.mocked(useAuthStore).mockReturnValue({
      user: { username: "Admin", email: "admin@example.com", avatar: "" },
      logout,
    } as any);

    render(<AdminHeader />);

    await user.click(screen.getByRole("button", { name: "Admin" }));
    await user.click(screen.getByText("header.logout"));

    expect(logout).toHaveBeenCalled();
    expect(mockToastError).toHaveBeenCalledWith("header.logoutFailed", {
      description: "boom",
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
