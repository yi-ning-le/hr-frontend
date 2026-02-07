// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SettingsPage } from "../SettingsPage";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
}));

// Mock useUserRole
const mockUseUserRole = vi.fn();
vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => mockUseUserRole(),
}));

// Mock Components
vi.mock("@/pages/settings/components/CandidateStatusSettings", () => ({
  CandidateStatusSettings: () => (
    <div data-testid="candidate-status-settings">Candidate Status Settings</div>
  ),
}));

vi.mock("@/pages/settings/components/GeneralSettings", () => ({
  GeneralSettings: () => (
    <div data-testid="general-settings">General Settings</div>
  ),
}));

vi.mock("@/pages/settings/components/RecruiterManagement", () => ({
  RecruiterManagement: () => (
    <div data-testid="recruiter-management">Recruiter Management</div>
  ),
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserRole.mockReturnValue({
      isAdmin: false,
      isLoading: false,
    });
  });

  it("renders the settings page header", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your account settings and preferences."),
    ).toBeInTheDocument();
  });

  it("renders only non-admin tabs for regular users", () => {
    render(<SettingsPage />);

    expect(screen.getByText("Candidate Statuses")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.queryByText("Recruiters")).not.toBeInTheDocument();
  });

  it("renders Recruiters tab for admin users", () => {
    mockUseUserRole.mockReturnValue({
      isAdmin: true,
      isLoading: false,
    });

    render(<SettingsPage />);

    expect(screen.getByText("Candidate Statuses")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Recruiters")).toBeInTheDocument();
  });

  it("switches content when tabs are clicked", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    // Default tab
    expect(screen.getByTestId("candidate-status-settings")).toBeInTheDocument();

    // Switch to General
    const generalTab = screen.getByRole("tab", { name: "General" });
    await user.click(generalTab);

    // Radix Tabs might need some wait or we can check presence if they stay in DOM
    // In our case, they are rendered via TABS.map(({component}) => component)
    expect(screen.getByTestId("general-settings")).toBeInTheDocument();
  });
});
