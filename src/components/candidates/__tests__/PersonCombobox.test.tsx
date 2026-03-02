// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PersonCombobox } from "../PersonCombobox";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

const mockOptions = [
  {
    id: "e1",
    firstName: "Alice",
    lastName: "Smith",
    department: "Engineering",
  },
  { id: "e2", firstName: "Bob", lastName: "Jones", department: "HR" },
  { id: "e3", firstName: "Charlie", lastName: "Brown", department: "Design" },
];

// Mock ResizeObserver & pointer capture (needed by Radix Popover)
beforeEach(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver;

  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.setPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("PersonCombobox", () => {
  it("renders with placeholder when no value is selected", () => {
    render(
      <PersonCombobox
        options={mockOptions}
        value=""
        onChange={vi.fn()}
        placeholder="Select person"
      />,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Select person")).toBeInTheDocument();
  });

  it("shows selected person name when a value is set", () => {
    render(
      <PersonCombobox
        options={mockOptions}
        value="e1"
        onChange={vi.fn()}
        placeholder="Select person"
      />,
    );

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  it("opens popover and displays all options on click", async () => {
    const user = userEvent.setup();

    render(
      <PersonCombobox
        options={mockOptions}
        value=""
        onChange={vi.fn()}
        placeholder="Select person"
        searchPlaceholder="Search…"
        emptyMessage="No results found."
      />,
    );

    await user.click(screen.getByRole("combobox"));

    // All three options should be visible
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
  });

  it("filters options when typing in search input", async () => {
    const user = userEvent.setup();

    render(
      <PersonCombobox
        options={mockOptions}
        value=""
        onChange={vi.fn()}
        placeholder="Select person"
        searchPlaceholder="Search…"
        emptyMessage="No results found."
      />,
    );

    await user.click(screen.getByRole("combobox"));

    // Type in search
    const searchInput = screen.getByPlaceholderText("Search…");
    await user.type(searchInput, "Alice");

    // Only Alice should be visible (cmdk filters by default)
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    // Bob and Charlie should be hidden by cmdk (aria-hidden or removed from view)
    const bobItem = screen.queryByText("Bob Jones");
    const charlieItem = screen.queryByText("Charlie Brown");
    // cmdk hides items by setting data-value and filtering — they may be aria-hidden
    // At minimum, Alice's item should be the only non-hidden one
    if (bobItem) {
      const bobCommandItem = bobItem.closest("[cmdk-item]");
      expect(bobCommandItem).toHaveAttribute("aria-hidden", "true");
    }
    if (charlieItem) {
      const charlieCommandItem = charlieItem.closest("[cmdk-item]");
      expect(charlieCommandItem).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("calls onChange with correct ID when selecting an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <PersonCombobox
        options={mockOptions}
        value=""
        onChange={onChange}
        placeholder="Select person"
        searchPlaceholder="Search…"
        emptyMessage="No results found."
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Bob Jones"));

    expect(onChange).toHaveBeenCalledWith("e2");
  });

  it("shows empty message when no options match search", async () => {
    const user = userEvent.setup();

    render(
      <PersonCombobox
        options={mockOptions}
        value=""
        onChange={vi.fn()}
        placeholder="Select person"
        searchPlaceholder="Search…"
        emptyMessage="No results found."
      />,
    );

    await user.click(screen.getByRole("combobox"));

    const searchInput = screen.getByPlaceholderText("Search…");
    await user.type(searchInput, "zzzzz");

    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <PersonCombobox
        options={mockOptions}
        value=""
        onChange={vi.fn()}
        placeholder="Select person"
        disabled={true}
      />,
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
