// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SettingsPage } from "../SettingsPage";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useCandidateStatuses
vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: [],
    fetchStatuses: vi.fn(),
  }),
}));

// Mock Tabs
vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`tab-${value}`}>{children}</div>,
  TabsContent: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`content-${value}`}>{children}</div>,
}));

// Mock CandidateStatusSettings component
vi.mock("@/pages/settings/components/CandidateStatusSettings", () => ({
  CandidateStatusSettings: () => (
    <div data-testid="candidate-status-settings">Candidate Status Settings</div>
  ),
}));

describe("SettingsPage", () => {
  it("renders the settings page header", () => {
    render(<SettingsPage />);
    expect(screen.getByText(/settings.title/)).toBeInTheDocument();
    expect(screen.getByText(/settings.description/)).toBeInTheDocument();
  });

  it("renders candidate statuses tab by default", () => {
    render(<SettingsPage />);
    expect(screen.getByTestId("candidate-status-settings")).toBeInTheDocument();
  });
});
