import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecruitmentPage } from "../RecruitmentPage";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "zh-CN",
    },
  }),
  initReactI18next: { type: "3rdParty" },
}));

// Mock subcomponents
vi.mock("../../../lib/parseResume", () => ({
  parseResume: vi.fn(),
}));

const mockNavigate = vi.fn();

// Mock Router
vi.mock("../../../routes/_protected/recruitment", () => ({
  Route: {
    useSearch: vi.fn(() => ({ tab: "overview" })),
    useNavigate: vi.fn(() => mockNavigate),
  },
}));

// Mock Stores
vi.mock("../../../stores/useJobStore", () => ({
  useJobStore: () => ({
    setIsAddDialogOpen: vi.fn(),
  }),
}));

vi.mock("../components/overview/RecruitmentStats", () => ({
  RecruitmentStats: () => (
    <div data-testid="recruitment-stats">Stats Component</div>
  ),
}));

vi.mock("../components/overview/RecentApplications", () => ({
  RecentApplications: () => (
    <div data-testid="recent-applications">Applications Component</div>
  ),
}));

vi.mock("@/components/candidates/PdfPreview", () => ({
  PdfPreview: () => <div data-testid="pdf-preview">PDF Preview Component</div>,
}));

describe("RecruitmentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header title", () => {
    render(<RecruitmentPage />);
    expect(screen.getByText("recruitment.title")).toBeInTheDocument();
    expect(screen.getByText("recruitment.subtitle")).toBeInTheDocument();
  });

  it("renders tabs", () => {
    render(<RecruitmentPage />);
    expect(screen.getByText("recruitment.tabs.overview")).toBeInTheDocument();
    expect(screen.getByText("recruitment.tabs.jobs")).toBeInTheDocument();
    expect(screen.getByText("recruitment.tabs.candidates")).toBeInTheDocument();
    expect(screen.getByText("recruitment.tabs.calendar")).toBeInTheDocument();
  });

  it("renders statistics and applications widgets in overview tab", () => {
    render(<RecruitmentPage />);
    // By default, Tabs renders the default content
    expect(screen.getByTestId("recruitment-stats")).toBeInTheDocument();
    expect(screen.getByTestId("recent-applications")).toBeInTheDocument();
  });

  it("updates only tab in route search params when tab changes", async () => {
    render(<RecruitmentPage />);
    const user = userEvent.setup();

    await user.click(screen.getByText("recruitment.tabs.jobs"));

    expect(mockNavigate).toHaveBeenCalled();
    const firstCallArg = mockNavigate.mock.calls[0][0];
    expect(firstCallArg.replace).toBe(true);
    expect(
      firstCallArg.search({
        q: "frontend",
        tab: "overview",
        page: 2,
      }),
    ).toEqual({
      q: "frontend",
      tab: "jobs",
      page: 2,
    });
  });
});
