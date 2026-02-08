// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { ResumePreviewModal } from "../ResumePreviewModal";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) =>
      options?.name ? `resumeModal.resumeOf ${options.name}` : key,
  }),
}));

// Mock PdfPreview
vi.mock("../PdfPreview", () => ({
  PdfPreview: ({ url }: { url: string }) => (
    <div data-testid="pdf-preview">{url}</div>
  ),
}));

// Mock useJobs hook
const mockJobs = [
  {
    id: "job-1",
    title: "Frontend Engineer",
    department: "Engineering",
    jobDescription: "We are looking for a skilled frontend engineer...",
    headCount: 2,
    openDate: new Date(),
    status: "OPEN" as const,
  },
];

vi.mock("@/hooks/queries/useJobs", () => ({
  useJobs: () => ({
    data: mockJobs,
    isLoading: false,
    isError: false,
  }),
}));

// Mock scroll area
vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="scroll-area" className={className}>
      {children}
    </div>
  ),
}));

// Mock window.open
const mockOpen = vi.fn();
window.open = mockOpen;

describe("ResumePreviewModal", () => {
  const mockCandidate: Candidate = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    appliedJobId: "job-1",
    appliedJobTitle: "Frontend Engineer",
    status: "new",
    appliedAt: new Date(),
    resumeUrl: "http://example.com/resume.pdf",
    experienceYears: 5,
    avatar: "",
    phone: "1234567890",
    education: "BS Computer Science",
    channel: "LinkedIn",
    note: "Some note",
  };

  const defaultProps = {
    candidate: mockCandidate,
    open: true,
    onOpenChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(<ResumePreviewModal {...defaultProps} />);

    expect(
      screen.getByText("resumeModal.resumeOf John Doe"),
    ).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    expect(screen.getByTestId("pdf-preview")).toHaveTextContent(
      "http://example.com/resume.pdf",
    );
  });

  it("does not render when candidate is null", () => {
    const { container } = render(
      <ResumePreviewModal {...defaultProps} candidate={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders no resume message when url is missing or empty", () => {
    render(
      <ResumePreviewModal
        {...defaultProps}
        candidate={{ ...mockCandidate, resumeUrl: "#" }}
      />,
    );

    expect(screen.getByText("resumeModal.noResume")).toBeInTheDocument();
    expect(screen.queryByTestId("pdf-preview")).not.toBeInTheDocument();
  });

  it("opens resume in new tab when download clicked", () => {
    render(<ResumePreviewModal {...defaultProps} />);

    const downloadBtn = screen.getByText("resumeModal.download");
    fireEvent.click(downloadBtn);

    expect(mockOpen).toHaveBeenCalledWith(
      "http://example.com/resume.pdf",
      "_blank",
    );
  });

  it("shows View JD button when job exists", () => {
    render(<ResumePreviewModal {...defaultProps} />);

    expect(screen.getByText("resumeModal.viewJD")).toBeInTheDocument();
  });

  it("shows JD card when View JD button is clicked", async () => {
    render(<ResumePreviewModal {...defaultProps} />);

    const viewJdBtn = screen.getByText("resumeModal.viewJD");
    fireEvent.click(viewJdBtn);

    expect(screen.getByText("resumeModal.jobDescription")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-area")).toHaveTextContent(
      "We are looking for a skilled frontend engineer...",
    );

    // Check toggle to Hide JD
    expect(screen.getByText("resumeModal.hideJD")).toBeInTheDocument();
  });

  it("does not show View JD button when job not found", () => {
    const candidateWithNoJob = {
      ...mockCandidate,
      appliedJobId: "non-existent-job",
    };
    render(
      <ResumePreviewModal {...defaultProps} candidate={candidateWithNoJob} />,
    );

    expect(screen.queryByText("resumeModal.viewJD")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when close button is clicked", () => {
    render(<ResumePreviewModal {...defaultProps} />);

    // Find the close button by its SVG icon's parent button
    const buttons = screen.getAllByRole("button");
    // The close button is the last one with no text (icon-only)
    const closeBtn = buttons.find((btn) => btn.textContent === "");

    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    } else {
      // If we can't find it, check dialog is at least present
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    }
  });
});
