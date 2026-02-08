// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddCandidateDialog } from "../AddCandidateDialog";

// IMPORTANT: Mock pdfjs-dist before any imports that use it
vi.mock("pdfjs-dist", () => ({
  getDocument: vi.fn(),
  GlobalWorkerOptions: { workerSrc: "" },
}));

// Mock parseResume before the component imports it
vi.mock("@/lib/parseResume", () => ({
  parseResume: vi
    .fn()
    .mockResolvedValue({ name: "Parsed", email: "parsed@test.com" }),
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

// Mock child components
vi.mock("../CandidateForm", () => ({
  CandidateForm: () => <div data-testid="candidate-form">Form</div>,
}));

// Mock useCreateCandidate hook
vi.mock("@/hooks/queries/useCandidates", () => ({
  useCreateCandidate: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("AddCandidateDialog", () => {
  it("renders trigger button", () => {
    render(<AddCandidateDialog />);
    expect(screen.getByText("recruitment.candidates.add")).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", async () => {
    render(<AddCandidateDialog />);

    const triggerButton = screen.getByText("recruitment.candidates.add");
    fireEvent.click(triggerButton);

    // After clicking trigger, dialog content should appear
    expect(
      await screen.findByText("recruitment.candidates.dialog.addTitle"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.dialog.uploadResume"),
    ).toBeInTheDocument();
  });
});
