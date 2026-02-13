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
  PdfPreview: ({ pdfUrl }: { pdfUrl: string }) => (
    <div data-testid="pdf-preview">{pdfUrl}</div>
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

// Mock useCandidateComments
vi.mock("@/hooks/queries/useCandidateComments", () => ({
  useCandidateComments: () => ({
    data: [],
    isLoading: false,
  }),
}));

// Mock CandidateCommentSidebar
vi.mock("@/components/candidates/comments/CandidateCommentSidebar", () => ({
  CandidateCommentSidebar: () => <div data-testid="comment-sidebar" />,
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
      screen.getByRole("heading", { name: "resumeModal.resumeOf John Doe" }),
    ).toBeInTheDocument();
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

    fireEvent.click(screen.getByLabelText("resumeModal.download"));
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

    fireEvent.click(screen.getByLabelText("common.close"));
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });
});
