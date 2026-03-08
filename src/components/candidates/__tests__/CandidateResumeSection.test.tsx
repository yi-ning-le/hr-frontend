// @vitest-environment jsdom
vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
  Document: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: () => <div data-testid="pdf-page">Page</div>,
}));

vi.mock("react-pdf/dist/Page/AnnotationLayer.css", () => ({}));
vi.mock("react-pdf/dist/Page/TextLayer.css", () => ({}));

import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { CandidateResumeSection } from "../CandidateResumeSection";

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver;
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

const mockCandidateWithResume: Candidate = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job1",
  appliedJobTitle: "Developer",
  channel: "LinkedIn",
  resumeUrl: "https://example.com/resume.pdf",
  status: "new",
  appliedAt: new Date("2024-01-01"),
  note: "",
};

const mockCandidateWithoutResume: Candidate = {
  ...mockCandidateWithResume,
  resumeUrl: "",
};

const defaultProps = {
  candidate: mockCandidateWithResume,
  onPreviewClick: vi.fn(),
  onResumeUpdate: vi.fn(),
  isResumeUpdating: false,
};

describe("CandidateResumeSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders section header", () => {
    render(<CandidateResumeSection {...defaultProps} />);

    expect(
      screen.getByText("recruitment.candidates.detail.resumePreview"),
    ).toBeInTheDocument();
  });

  it("renders resume preview and download when resume exists", () => {
    render(<CandidateResumeSection {...defaultProps} />);

    expect(
      screen.getByText("recruitment.candidates.detail.viewResume"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.detail.downloadResume"),
    ).toBeInTheDocument();
  });

  it("calls onPreviewClick when preview button is clicked", () => {
    const onPreviewClick = vi.fn();
    render(
      <CandidateResumeSection
        {...defaultProps}
        onPreviewClick={onPreviewClick}
      />,
    );

    const previewButton = screen
      .getByText("recruitment.candidates.detail.viewResume")
      .closest("button");
    if (previewButton) {
      fireEvent.click(previewButton);
    }

    expect(onPreviewClick).toHaveBeenCalled();
  });

  it("opens resume URL when download is clicked", () => {
    const openMock = vi.fn();
    vi.stubGlobal("open", openMock);

    render(<CandidateResumeSection {...defaultProps} />);

    fireEvent.click(
      screen.getByText("recruitment.candidates.detail.downloadResume"),
    );

    expect(openMock).toHaveBeenCalledWith(
      "https://example.com/resume.pdf",
      "_blank",
    );
    vi.unstubAllGlobals();
  });

  it("renders no-resume text and hides actions when resume is missing", () => {
    render(
      <CandidateResumeSection
        {...defaultProps}
        candidate={mockCandidateWithoutResume}
      />,
    );

    expect(
      screen.getByText("recruitment.candidates.detail.noResume"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("recruitment.candidates.detail.downloadResume"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("recruitment.candidates.detail.viewResume"),
    ).not.toBeInTheDocument();
  });

  it("renders replace resume button when onResumeUpdate is provided", () => {
    render(<CandidateResumeSection {...defaultProps} />);

    expect(
      screen.getByText("recruitment.candidates.detail.replaceResume"),
    ).toBeInTheDocument();
  });

  it("does not render replace resume button when onResumeUpdate is not provided", () => {
    render(
      <CandidateResumeSection
        candidate={mockCandidateWithResume}
        onPreviewClick={vi.fn()}
      />,
    );

    expect(
      screen.queryByText("recruitment.candidates.detail.replaceResume"),
    ).not.toBeInTheDocument();
  });

  it("calls onResumeUpdate with selected file when file is chosen", () => {
    const onResumeUpdate = vi.fn();
    render(
      <CandidateResumeSection
        {...defaultProps}
        onResumeUpdate={onResumeUpdate}
      />,
    );

    const fileInput = screen.getByTestId("resume-file-input");
    const file = new File(["dummy pdf"], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(onResumeUpdate).toHaveBeenCalledWith(file);
  });

  it("disables replace button while resume update is pending", () => {
    render(
      <CandidateResumeSection {...defaultProps} isResumeUpdating={true} />,
    );

    expect(
      screen.getByText("recruitment.candidates.detail.replaceResume"),
    ).toBeDisabled();
  });
});
