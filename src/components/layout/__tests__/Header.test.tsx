// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
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

describe("Header Navigation", () => {
  it("contains a link to the settings page in the dropdown menu", async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Open the dropdown by clicking the avatar/button
    const avatarButton = screen.getByRole("button", { name: /admin/i });
    await user.click(avatarButton);

    // Check if the Settings link is present and points to the correct route
    const settingsLink = screen.getByRole("link", { name: /settings/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", "/settings");
  });
});
