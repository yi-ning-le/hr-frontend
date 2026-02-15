// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResumeUploader } from "@/components/candidates/resume/ResumeUploader";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

describe("ResumeUploader", () => {
  const mockOnUpload = vi.fn();

  const renderComponent = (isUploading = false) => {
    return render(
      <ResumeUploader isUploading={isUploading} onUpload={mockOnUpload} />,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial render", () => {
    it("renders upload area with section role", () => {
      renderComponent();

      const section = screen.getByLabelText(
        "recruitment.candidates.detail.noResume",
      );
      expect(section).toBeInTheDocument();
    });

    it("renders UploadCloud icon", () => {
      renderComponent();

      const icon = document.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("displays no resume message", () => {
      renderComponent();

      expect(
        screen.getByText("recruitment.candidates.detail.noResume"),
      ).toBeInTheDocument();
    });

    it("displays upload hint", () => {
      renderComponent();

      expect(
        screen.getByText("recruitment.candidates.detail.uploadHint"),
      ).toBeInTheDocument();
    });

    it("renders upload button", () => {
      renderComponent();

      expect(
        screen.getByText("recruitment.candidates.detail.uploadResume"),
      ).toBeInTheDocument();
    });

    it("has file input with correct attributes", () => {
      renderComponent();

      const input = document.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("accept", ".pdf,.doc,.docx");
    });
  });

  describe("File selection", () => {
    it("calls onUpload when file is selected via input", () => {
      renderComponent();

      const file = new File(["test content"], "resume.pdf", {
        type: "application/pdf",
      });
      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      expect(mockOnUpload).toHaveBeenCalledWith(file);
    });

    it("does not call onUpload when input change has no files", () => {
      renderComponent();

      const input = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [] } });

      expect(mockOnUpload).not.toHaveBeenCalled();
    });
  });

  describe("Drag and drop", () => {
    it("changes styling on drag over", () => {
      renderComponent();

      const section = screen.getByLabelText(
        "recruitment.candidates.detail.noResume",
      );

      fireEvent.dragOver(section);

      expect(section).toHaveClass("border-primary", "bg-primary/5");
    });

    it("reverts styling on drag leave", () => {
      renderComponent();

      const section = screen.getByLabelText(
        "recruitment.candidates.detail.noResume",
      );

      fireEvent.dragOver(section);
      fireEvent.dragLeave(section);

      expect(section).not.toHaveClass("border-primary");
    });

    it("calls onUpload when file is dropped", () => {
      renderComponent();

      const section = screen.getByLabelText(
        "recruitment.candidates.detail.noResume",
      );
      const file = new File(["test content"], "resume.pdf", {
        type: "application/pdf",
      });

      fireEvent.drop(section, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(mockOnUpload).toHaveBeenCalledWith(file);
    });

    it("reverts styling after drop", () => {
      renderComponent();

      const section = screen.getByLabelText(
        "recruitment.candidates.detail.noResume",
      );
      const file = new File(["test content"], "resume.pdf", {
        type: "application/pdf",
      });

      fireEvent.dragOver(section);
      fireEvent.drop(section, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(section).not.toHaveClass("border-primary");
    });

    it("displays drop message when dragging", () => {
      renderComponent();

      const section = screen.getByLabelText(
        "recruitment.candidates.detail.noResume",
      );

      fireEvent.dragOver(section);

      expect(
        screen.getByText("recruitment.candidates.detail.dropToUpload"),
      ).toBeInTheDocument();
    });
  });

  describe("Uploading state", () => {
    it("renders loading indicator when uploading", () => {
      renderComponent(true);

      expect(
        screen.getByText("recruitment.candidates.detail.uploadingResume"),
      ).toBeInTheDocument();
    });

    it("renders spinning loader icon when uploading", () => {
      renderComponent(true);

      const loader = document.querySelector(".animate-spin");
      expect(loader).toBeInTheDocument();
    });

    it("does not render upload button when uploading", () => {
      renderComponent(true);

      expect(
        screen.queryByText("recruitment.candidates.detail.uploadResume"),
      ).not.toBeInTheDocument();
    });

    it("does not render hint text when uploading", () => {
      renderComponent(true);

      expect(
        screen.queryByText("recruitment.candidates.detail.uploadHint"),
      ).not.toBeInTheDocument();
    });
  });
});
