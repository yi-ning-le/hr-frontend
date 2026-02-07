// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { CandidateDetailHeader } from "../CandidateDetailHeader";
import type { Candidate } from "@/types/candidate";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: [
      { id: "1", slug: "new", name: "New", type: "system", color: "#000000" },
      {
        id: "2",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#00FF00",
      },
    ],
    statusMap: {
      new: {
        id: "1",
        slug: "new",
        name: "New",
        type: "system",
        color: "#000000",
      },
      interview: {
        id: "2",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#00FF00",
      },
    },
  }),
}));

// Mock DOM APIs for Radix UI in jsdom
beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver;

  // Mock scrollIntoView for Radix Select
  Element.prototype.scrollIntoView = vi.fn();
});

const mockCandidate: Candidate = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job1",
  appliedJobTitle: "Frontend Developer",
  channel: "LinkedIn",
  resumeUrl: "resume.pdf",
  status: "new",
  appliedAt: new Date("2024-01-01"),
  note: "Good candidate",
};

// Helper to render with Dialog context
const renderWithDialog = (
  props: Partial<React.ComponentProps<typeof CandidateDetailHeader>> = {},
) => {
  const defaultProps = {
    candidate: mockCandidate,
    onStatusChange: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  return render(
    <Dialog open={true}>
      <DialogContent>
        <CandidateDetailHeader {...defaultProps} {...props} />
      </DialogContent>
    </Dialog>,
  );
};

describe("CandidateDetailHeader", () => {
  it("renders candidate name and avatar fallback", () => {
    renderWithDialog();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("JO")).toBeInTheDocument(); // Avatar fallback
  });

  it("renders applied position", () => {
    renderWithDialog();

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.detail.appliedPosition"),
    ).toBeInTheDocument();
  });

  it("renders channel and experience badges", () => {
    renderWithDialog();

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.card.yearsExp"),
    ).toBeInTheDocument();
  });

  it("renders status selector with current status", () => {
    renderWithDialog();

    // The select trigger should show current status text
    expect(
      screen.getByText("recruitment.candidates.statusOptions.new"),
    ).toBeInTheDocument();
  });

  it("renders dropdown menu trigger button", () => {
    renderWithDialog();

    // Find the dropdown trigger button (the one with MoreHorizontal icon)
    const buttons = screen.getAllByRole("button");
    // Should have: select trigger (combobox role), dropdown trigger, dialog close button
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders combobox for status selection", () => {
    renderWithDialog();

    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeInTheDocument();
  });

  it("calls onStatusChange when status is changed", async () => {
    const onStatusChange = vi.fn();
    renderWithDialog({ onStatusChange });

    // Open the select
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    // Wait for options and click one
    await waitFor(() => {
      const interviewOption = screen.getByRole("option", {
        name: "recruitment.candidates.statusOptions.interview",
      });
      fireEvent.click(interviewOption);
    });

    expect(onStatusChange).toHaveBeenCalledWith("interview");
  });
});
