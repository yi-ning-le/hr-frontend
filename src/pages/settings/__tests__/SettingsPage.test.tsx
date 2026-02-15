// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
      isRecruiter: true,
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

  it("renders settings tabs", () => {
    render(<SettingsPage />);

    expect(screen.getByText("Candidate Statuses")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.queryByText("Recruiters")).not.toBeInTheDocument();
  });

  it("switches content when tabs are clicked (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    // Default tab
    expect(screen.getByTestId("candidate-status-settings")).toBeInTheDocument();

    // Switch to General
    const generalTab = screen.getByRole("tab", { name: "General" });
    await user.click(generalTab);

    // Wait for the content to appear after tab switch
    const generalSettings = await screen.findByTestId("general-settings");
    expect(generalSettings).toBeInTheDocument();
  });

  it("respects activeTab prop (controlled)", () => {
    render(<SettingsPage activeTab="general" />);
    // Should show General tab content immediately
    expect(screen.getByTestId("general-settings")).toBeInTheDocument();
    expect(
      screen.queryByTestId("candidate-status-settings"),
    ).not.toBeInTheDocument();
  });

  it("calls onTabChange when tab is clicked (controlled)", async () => {
    const user = userEvent.setup();
    const handleTabChange = vi.fn();
    render(
      <SettingsPage
        activeTab="candidate-statuses"
        onTabChange={handleTabChange}
      />,
    );

    const generalTab = screen.getByRole("tab", { name: "General" });
    await user.click(generalTab);

    expect(handleTabChange).toHaveBeenCalledWith("general");
  });
});
