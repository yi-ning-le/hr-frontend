// @vitest-environment jsdom
// Mock react-pdf which is imported by PdfPreview - must be hoisted
vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: "" } },
  Document: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: () => <div data-testid="pdf-page">Page</div>,
}));

// Mock the CSS imports
vi.mock("react-pdf/dist/Page/AnnotationLayer.css", () => ({}));
vi.mock("react-pdf/dist/Page/TextLayer.css", () => ({}));

import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { CandidateResumeSection } from "../CandidateResumeSection";

// Mock ResizeObserver for jsdom
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

const mockCandidateWithPlaceholderResume: Candidate = {
  ...mockCandidateWithResume,
  resumeUrl: "#",
};

const defaultProps = {
  candidate: mockCandidateWithResume,
  isUploadingResume: false,
  onResumeUpload: vi.fn(),
  onPreviewClick: vi.fn(),
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

  describe("With resume", () => {
    it("renders resume preview button", () => {
      render(<CandidateResumeSection {...defaultProps} />);

      expect(
        screen.getByText("recruitment.candidates.detail.viewResume"),
      ).toBeInTheDocument();
    });

    it("renders download button", () => {
      render(<CandidateResumeSection {...defaultProps} />);

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

      // Find the clickable button containing viewResume text
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

      const downloadButton = screen.getByText(
        "recruitment.candidates.detail.downloadResume",
      );
      fireEvent.click(downloadButton);

      expect(openMock).toHaveBeenCalledWith(
        "https://example.com/resume.pdf",
        "_blank",
      );

      vi.unstubAllGlobals();
    });
  });

  describe("Without resume", () => {
    it("renders upload area when no resume URL", () => {
      render(
        <CandidateResumeSection
          {...defaultProps}
          candidate={mockCandidateWithoutResume}
        />,
      );

      expect(
        screen.getByText("recruitment.candidates.detail.noResume"),
      ).toBeInTheDocument();
    });

    it("renders upload area when resume URL is placeholder", () => {
      render(
        <CandidateResumeSection
          {...defaultProps}
          candidate={mockCandidateWithPlaceholderResume}
        />,
      );

      expect(
        screen.getByText("recruitment.candidates.detail.noResume"),
      ).toBeInTheDocument();
    });

    it("renders upload button", () => {
      render(
        <CandidateResumeSection
          {...defaultProps}
          candidate={mockCandidateWithoutResume}
        />,
      );

      expect(
        screen.getByText("recruitment.candidates.detail.uploadResume"),
      ).toBeInTheDocument();
    });

    it("renders upload hint", () => {
      render(
        <CandidateResumeSection
          {...defaultProps}
          candidate={mockCandidateWithoutResume}
        />,
      );

      expect(
        screen.getByText("recruitment.candidates.detail.uploadHint"),
      ).toBeInTheDocument();
    });

    it("does not render download button", () => {
      render(
        <CandidateResumeSection
          {...defaultProps}
          candidate={mockCandidateWithoutResume}
        />,
      );

      expect(
        screen.queryByText("recruitment.candidates.detail.downloadResume"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Upload in progress", () => {
    it("renders loading indicator when uploading", () => {
      render(
        <CandidateResumeSection
          {...defaultProps}
          candidate={mockCandidateWithoutResume}
          isUploadingResume={true}
        />,
      );

      expect(
        screen.getByText("recruitment.candidates.detail.uploadingResume"),
      ).toBeInTheDocument();
    });

    it("does not render upload button when uploading", () => {
      render(
        <CandidateResumeSection
          {...defaultProps}
          candidate={mockCandidateWithoutResume}
          isUploadingResume={true}
        />,
      );

      expect(
        screen.queryByText("recruitment.candidates.detail.uploadResume"),
      ).not.toBeInTheDocument();
    });
  });

  describe("File upload handling", () => {
    it("calls onResumeUpload when file is selected via input", () => {
      const onResumeUpload = vi.fn();
      render(
        <CandidateResumeSection
          {...defaultProps}
          candidate={mockCandidateWithoutResume}
          onResumeUpload={onResumeUpload}
        />,
      );

      const file = new File(["test"], "resume.pdf", {
        type: "application/pdf",
      });
      const input = document.querySelector('input[type="file"]');

      if (input) {
        fireEvent.change(input, { target: { files: [file] } });
      }

      expect(onResumeUpload).toHaveBeenCalledWith(file);
    });
  });
});
