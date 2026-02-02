import { render, screen } from "@testing-library/react";
import { RecruitmentPage } from "../RecruitmentPage";
import { describe, it, expect, vi } from "vitest";

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'zh-CN',
    },
  }),
}));

// Mock subcomponents
vi.mock("../../../lib/parseResume", () => ({
  parseResume: vi.fn(),
}));

// Mock Router
vi.mock("../../../routes/_protected/recruitment", () => ({
  Route: {
    useSearch: vi.fn(() => ({ tab: "overview" })),
    useNavigate: vi.fn(() => vi.fn()),
  },
}));

// Mock Stores
vi.mock("../../../stores/useJobStore", () => ({
  useJobStore: () => ({
    setIsAddDialogOpen: vi.fn(),
  }),
}));

vi.mock("../components/overview/RecruitmentStats", () => ({
  RecruitmentStats: () => <div data-testid="recruitment-stats">Stats Component</div>,
}));

vi.mock("../components/overview/RecentApplications", () => ({
  RecentApplications: () => <div data-testid="recent-applications">Applications Component</div>,
}));

vi.mock("../components/candidates/PdfPreview", () => ({
  PdfPreview: () => <div data-testid="pdf-preview">PDF Preview Component</div>,
}));

describe("RecruitmentPage", () => {
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
});
