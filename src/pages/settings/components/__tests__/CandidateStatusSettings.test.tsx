// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CandidateStatusDefinition } from "@/types/candidate";
import { CandidateStatusSettings } from "../CandidateStatusSettings";

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

// Mock scrollIntoView for Radix primitives
window.HTMLElement.prototype.scrollIntoView = vi.fn();

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
      // Manage internal state if open prop is not provided (uncontrolled)
      // or rely on the parent providing it.
      // In this test, the key is that DialogTrigger needs to update the state.
      // But CandidateStatusSettings CONTROLS the state.

      // Wait, CandidateStatusSettings uses controlled Dialog: <Dialog open={open} onOpenChange={setOpen}>
      // So the mock should respect the props.

      return (
        <DialogContext.Provider
          value={{ open: !!open, setOpen: onOpenChange || (() => {}) }}
        >
          <div>{children}</div>
        </DialogContext.Provider>
      );
    },
    DialogContent: ({ children }: { children: React.ReactNode }) => {
      const { open } = React.useContext(DialogContext);
      return open ? <div role="dialog">{children}</div> : null;
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
      const { setOpen } = React.useContext(DialogContext);
      return (
        <div data-testid="dialog-trigger" onClick={() => setOpen(true)}>
          {children}
        </div>
      );
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders status list correctly", () => {
    render(<CandidateStatusSettings />);

    expect(
      screen.getByText(/settings.candidateStatus.title/),
    ).toBeInTheDocument();

    expect(
      screen.getByText("recruitment.candidates.statusOptions.new"),
    ).toBeInTheDocument();
  });

  it("renders add status button correctly", () => {
    render(<CandidateStatusSettings />);

    const triggers = screen.getAllByTestId("dialog-trigger");
    const addTrigger = triggers.find((t) =>
      t.textContent?.includes("settings.candidateStatus.addStatus"),
    );

    expect(addTrigger).toBeDefined();
    expect(addTrigger).toHaveTextContent("settings.candidateStatus.addStatus");
  });

  it("allows adding a new status", async () => {
    const user = userEvent.setup();
    render(<CandidateStatusSettings />);

    // Find and click the Add Status button
    const triggers = screen.getAllByTestId("dialog-trigger");
    const addTrigger = triggers.find((t) =>
      t.textContent?.includes("settings.candidateStatus.addStatus"),
    );

    expect(addTrigger).toBeDefined();
    await user.click(addTrigger!);

    // Check if dialog content appears
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText("settings.candidateStatus.addNew"),
    ).toBeInTheDocument();

    // Form interactions
    // In our implementation we used:
    // <FormLabel className="text-right">{t("settings.candidateStatus.name", "Name")}</FormLabel>
    // The mock returns the key "settings.candidateStatus.name".

    const nameInput = screen.getByLabelText("settings.candidateStatus.name");
    await user.type(nameInput, "New Status Name");

    const createButton = screen.getByRole("button", { name: "common.create" });
    await user.click(createButton);

    await waitFor(() => {
      expect(mockCreateStatus).toHaveBeenCalledWith(
        "New Status Name",
        "#000000",
      );
    });
  });
});
