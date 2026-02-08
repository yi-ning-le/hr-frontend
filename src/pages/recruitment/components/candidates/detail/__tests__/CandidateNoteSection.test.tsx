// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { CandidateNoteSection } from "../CandidateNoteSection";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

const mockCandidate: Candidate = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  experienceYears: 5,
  education: "Bachelor",
  appliedJobId: "job1",
  appliedJobTitle: "Developer",
  channel: "LinkedIn",
  resumeUrl: "resume.pdf",
  status: "new",
  appliedAt: new Date("2024-01-01"),
  note: "This is a test note",
};

const defaultProps = {
  candidate: mockCandidate,
  isEditingNote: false,
  noteContent: "",
  onNoteChange: vi.fn(),
  onNoteSave: vi.fn(),
  onNoteCancel: vi.fn(),
  onEditClick: vi.fn(),
};

describe("CandidateNoteSection", () => {
  it("renders section header", () => {
    render(<CandidateNoteSection {...defaultProps} />);

    expect(
      screen.getByText("recruitment.candidates.detail.interviewerNotes"),
    ).toBeInTheDocument();
  });

  describe("Display mode", () => {
    it("renders note content when available", () => {
      render(<CandidateNoteSection {...defaultProps} />);

      expect(screen.getByText("This is a test note")).toBeInTheDocument();
    });

    it("renders empty state when no note", () => {
      const candidateWithoutNote = { ...mockCandidate, note: "" };
      render(
        <CandidateNoteSection
          {...defaultProps}
          candidate={candidateWithoutNote}
        />,
      );

      expect(
        screen.getByText("recruitment.candidates.detail.noNotesYet"),
      ).toBeInTheDocument();
    });

    it("renders edit button in display mode", () => {
      render(<CandidateNoteSection {...defaultProps} />);

      const editButton = screen.getByLabelText("common.edit");
      expect(editButton).toBeInTheDocument();
    });

    it("calls onEditClick when edit button is clicked", () => {
      const onEditClick = vi.fn();
      render(
        <CandidateNoteSection {...defaultProps} onEditClick={onEditClick} />,
      );

      const editButton = screen.getByLabelText("common.edit");
      fireEvent.click(editButton);

      expect(onEditClick).toHaveBeenCalled();
    });

    it("calls onEditClick when note area is clicked", () => {
      const onEditClick = vi.fn();
      render(
        <CandidateNoteSection {...defaultProps} onEditClick={onEditClick} />,
      );

      const noteArea = screen.getByText("This is a test note");
      fireEvent.click(noteArea);

      expect(onEditClick).toHaveBeenCalled();
    });
  });

  describe("Edit mode", () => {
    const editModeProps = {
      ...defaultProps,
      isEditingNote: true,
      noteContent: "Editing this note",
    };

    it("renders textarea with current content", () => {
      render(<CandidateNoteSection {...editModeProps} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue("Editing this note");
    });

    it("renders save and cancel buttons", () => {
      render(<CandidateNoteSection {...editModeProps} />);

      expect(screen.getByText("common.save")).toBeInTheDocument();
      expect(screen.getByText("common.cancel")).toBeInTheDocument();
    });

    it("calls onNoteChange when typing in textarea", () => {
      const onNoteChange = vi.fn();
      render(
        <CandidateNoteSection {...editModeProps} onNoteChange={onNoteChange} />,
      );

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "New content" } });

      expect(onNoteChange).toHaveBeenCalledWith("New content");
    });

    it("calls onNoteSave when save button is clicked", () => {
      const onNoteSave = vi.fn();
      render(
        <CandidateNoteSection {...editModeProps} onNoteSave={onNoteSave} />,
      );

      const saveButton = screen.getByText("common.save");
      fireEvent.click(saveButton);

      expect(onNoteSave).toHaveBeenCalled();
    });

    it("calls onNoteCancel when cancel button is clicked", () => {
      const onNoteCancel = vi.fn();
      render(
        <CandidateNoteSection {...editModeProps} onNoteCancel={onNoteCancel} />,
      );

      const cancelButton = screen.getByText("common.cancel");
      fireEvent.click(cancelButton);

      expect(onNoteCancel).toHaveBeenCalled();
    });

    it("does not render edit button in edit mode", () => {
      render(<CandidateNoteSection {...editModeProps} />);

      // Only save and cancel buttons should be present
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });
  });
});
