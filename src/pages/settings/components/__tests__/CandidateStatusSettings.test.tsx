// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { CandidateStatusSettings } from "../CandidateStatusSettings";
import type { CandidateStatusDefinition } from "@/types/candidate";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useCandidateStatuses
const mockStatuses: CandidateStatusDefinition[] = [
  {
    id: "1",
    slug: "new",
    name: "New",
    type: "system",
    color: "#000000",
    sort_order: 1,
  },
  {
    id: "2",
    slug: "custom",
    name: "Custom Status",
    type: "custom",
    color: "#ff0000",
    sort_order: 2,
  },
];

const mockCreateStatus = vi.fn();
const mockUpdateStatus = vi.fn();
const mockDeleteStatus = vi.fn();
const mockReorderStatuses = vi.fn();

vi.mock("@/hooks/useCandidateStatuses", () => ({
  useCandidateStatuses: () => ({
    statuses: mockStatuses,
    createStatus: mockCreateStatus,
    updateStatus: mockUpdateStatus,
    deleteStatus: mockDeleteStatus,
    reorderStatuses: mockReorderStatuses,
  }),
}));

// Mock UI components with Context for Dialog
const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

vi.mock("@/components/ui/dialog", () => {
  return {
    Dialog: ({
      children,
      open,
      onOpenChange,
    }: {
      children: React.ReactNode;
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
    }) => {
      return (
        <DialogContext.Provider
          value={{ open: !!open, setOpen: onOpenChange || (() => {}) }}
        >
          <div>{children}</div>
        </DialogContext.Provider>
      );
    },
    DialogContent: ({ children }: { children: React.ReactNode }) => {
      return (
        <DialogContext.Consumer>
          {({ open }) => (open ? <div>{children}</div> : null)}
        </DialogContext.Consumer>
      );
    },
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTrigger: ({
      children,
    }: {
      children: React.ReactNode;
      asChild?: boolean;
    }) => {
      // Simple mock that renders children
      return <div data-testid="dialog-trigger">{children}</div>;
    },
    DialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

vi.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Droppable: ({
    children,
  }: {
    children: (provided: {
      droppableProps: unknown;
      innerRef: (el: HTMLElement | null) => void;
      placeholder?: React.ReactNode;
    }) => React.ReactNode;
  }) => (
    <div>
      {children({
        droppableProps: {},
        innerRef: vi.fn(),
        placeholder: null,
      })}
    </div>
  ),
  Draggable: ({
    children,
  }: {
    children: (provided: {
      draggableProps: unknown;
      dragHandleProps: unknown;
      innerRef: (el: HTMLElement | null) => void;
    }) => React.ReactNode;
  }) => (
    <div>
      {children({
        draggableProps: {},
        dragHandleProps: {},
        innerRef: vi.fn(),
      })}
    </div>
  ),
}));

describe("CandidateStatusSettings", () => {
  it("renders status list correctly", () => {
    render(<CandidateStatusSettings />);

    expect(
      screen.getByText(/settings.candidateStatus.title/),
    ).toBeInTheDocument();

    // Check system status translation
    expect(
      screen.getByText("recruitment.candidates.statusOptions.new"),
    ).toBeInTheDocument();
  });

  it("renders add status button correctly", () => {
    render(<CandidateStatusSettings />);

    // Check that the add button exists with correct translation key
    // We use getAllByTestId because our mock renders a specific wrapper
    const triggers = screen.getAllByTestId("dialog-trigger");
    const addTrigger = triggers.find((t) =>
      t.textContent?.includes("settings.candidateStatus.addStatus"),
    );

    expect(addTrigger).toBeDefined();
    expect(addTrigger).toHaveTextContent("settings.candidateStatus.addStatus");
  });
});
