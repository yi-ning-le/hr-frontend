// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { CandidateInfoSection } from "../CandidateInfoSection";

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
  education: "Bachelor Degree",
  appliedJobId: "job1",
  appliedJobTitle: "Developer",
  channel: "LinkedIn",
  resumeUrl: "resume.pdf",
  status: "new",
  appliedAt: new Date("2024-01-15T10:30:00"),
  note: "",
};

describe("CandidateInfoSection", () => {
  it("renders section header with icon", () => {
    render(<CandidateInfoSection candidate={mockCandidate} />);

    expect(
      screen.getByText("recruitment.candidates.detail.basicInfo"),
    ).toBeInTheDocument();
  });

  it("renders email with label", () => {
    render(<CandidateInfoSection candidate={mockCandidate} />);

    expect(
      screen.getByText("recruitment.candidates.detail.email"),
    ).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders phone with label", () => {
    render(<CandidateInfoSection candidate={mockCandidate} />);

    expect(
      screen.getByText("recruitment.candidates.detail.phone"),
    ).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });

  it("renders education with label", () => {
    render(<CandidateInfoSection candidate={mockCandidate} />);

    expect(
      screen.getByText("recruitment.candidates.detail.education"),
    ).toBeInTheDocument();
    expect(screen.getByText("Bachelor Degree")).toBeInTheDocument();
  });

  it("renders applied date with label", () => {
    render(<CandidateInfoSection candidate={mockCandidate} />);

    expect(
      screen.getByText("recruitment.candidates.detail.appliedAt"),
    ).toBeInTheDocument();
    // Check formatted date
    expect(screen.getByText("2024-01-15 10:30")).toBeInTheDocument();
  });
});
