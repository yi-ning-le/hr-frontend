// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StatusItem } from "../StatusItem";
import type { CandidateStatusDefinition } from "@/types/candidate";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue: string) => defaultValue,
  }),
}));

// Mock dnd
vi.mock("@hello-pangea/dnd", () => ({
  Draggable: ({
    children,
  }: {
    children: (provided: {
      draggableProps: unknown;
      dragHandleProps: unknown;
      innerRef: (el: HTMLElement | null) => void;
    }) => React.ReactNode;
  }) =>
    children({
      draggableProps: {},
      dragHandleProps: {},
      innerRef: vi.fn(),
    }),
}));

const mockStatus: CandidateStatusDefinition = {
  id: "1",
  slug: "test-status",
  name: "Test Status",
  type: "custom",
  color: "#ff0000",
  sort_order: 1,
};

describe("StatusItem", () => {
  it("renders status information correctly", () => {
    render(
      <StatusItem
        status={mockStatus}
        index={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Test Status")).toBeInTheDocument();
    expect(screen.getByText("custom")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <StatusItem
        status={mockStatus}
        index={0}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    // Assuming Pencil icon is in the edit button
    // We can find button by implicit role or class, but let's try finding the icon container if needed
    // Actually, userEvent click works on the button.
    // Let's rely on the fact there are two buttons, first is edit, second is delete for custom status.
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    expect(onEdit).toHaveBeenCalledWith(mockStatus);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <StatusItem
        status={mockStatus}
        index={0}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    const buttons = screen.getAllByRole("button");
    // Delete button is the second one for custom status
    await user.click(buttons[1]);

    expect(onDelete).toHaveBeenCalledWith(mockStatus);
  });

  it("does not show delete button for system status", () => {
    const systemStatus = { ...mockStatus, type: "system" as const };
    render(
      <StatusItem
        status={systemStatus}
        index={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1); // Only edit button
  });
});
