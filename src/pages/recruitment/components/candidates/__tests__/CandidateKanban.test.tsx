// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Candidate } from "@/types/candidate";
import { CandidateKanban } from "../CandidateKanban";

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
        slug: "screening",
        name: "Screening",
        type: "system",
        color: "#000000",
      },
      {
        id: "3",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#000000",
      },
      {
        id: "4",
        slug: "offer",
        name: "Offer",
        type: "system",
        color: "#000000",
      },
      {
        id: "5",
        slug: "hired",
        name: "Hired",
        type: "system",
        color: "#000000",
      },
      {
        id: "6",
        slug: "rejected",
        name: "Rejected",
        type: "system",
        color: "#000000",
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
      screening: {
        id: "2",
        slug: "screening",
        name: "Screening",
        type: "system",
        color: "#000000",
      },
      interview: {
        id: "3",
        slug: "interview",
        name: "Interview",
        type: "system",
        color: "#000000",
      },
      offer: {
        id: "4",
        slug: "offer",
        name: "Offer",
        type: "system",
        color: "#000000",
      },
      hired: {
        id: "5",
        slug: "hired",
        name: "Hired",
        type: "system",
        color: "#000000",
      },
      rejected: {
        id: "6",
        slug: "rejected",
        name: "Rejected",
        type: "system",
        color: "#000000",
      },
    },
  }),
}));

// Mock dnd with proper snapshot object
vi.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Droppable: ({
    children,
  }: {
    children: (
      provided: {
        innerRef: ReturnType<typeof vi.fn>;
        droppableProps: object;
        placeholder: null;
      },
      snapshot: {
        isDraggingOver: boolean;
        draggingFromThisWith: null;
        draggingOverWith: null;
        isUsingPlaceholder: boolean;
      },
    ) => React.ReactNode;
  }) =>
    children(
      { innerRef: vi.fn(), droppableProps: {}, placeholder: null },
      {
        isDraggingOver: false,
        draggingFromThisWith: null,
        draggingOverWith: null,
        isUsingPlaceholder: false,
      },
    ),
  Draggable: ({
    children,
  }: {
    children: (
      provided: {
        innerRef: ReturnType<typeof vi.fn>;
        draggableProps: object;
        dragHandleProps: object;
      },
      snapshot: {
        isDragging: boolean;
        isDropAnimating: boolean;
        draggingOver: null;
        combineWith: null;
        combineTargetFor: null;
        mode: null;
      },
    ) => React.ReactNode;
  }) =>
    children(
      { innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} },
      {
        isDragging: false,
        isDropAnimating: false,
        draggingOver: null,
        combineWith: null,
        combineTargetFor: null,
        mode: null,
      },
    ),
}));

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "John Doe",
    status: "new",
    appliedJobTitle: "Dev",
    experienceYears: 2,
    education: "BS",
    avatar: "",
  } as Candidate,
  {
    id: "2",
    name: "Jane Smith",
    status: "interview",
    appliedJobTitle: "PM",
    experienceYears: 3,
    education: "MS",
    avatar: "",
  } as Candidate,
];

describe("CandidateKanban", () => {
  it("renders all status columns", () => {
    render(
      <CandidateKanban
        candidates={[]}
        onDragEnd={vi.fn()}
        onCandidateClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText("recruitment.candidates.statusOptions.new"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.statusOptions.screening"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.statusOptions.interview"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.statusOptions.offer"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.statusOptions.hired"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("recruitment.candidates.statusOptions.rejected"),
    ).toBeInTheDocument();
  });

  it("renders candidates in columns", () => {
    render(
      <CandidateKanban
        candidates={mockCandidates}
        onDragEnd={vi.fn()}
        onCandidateClick={vi.fn()}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });
});
