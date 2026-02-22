// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ColumnDef } from "../CandidateTable";
import { CandidateTable, formatDate } from "../CandidateTable";

interface TestCandidate {
  id: string;
  name: string;
  email: string;
  position: string;
}

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

const mockColumns: ColumnDef<TestCandidate>[] = [
  {
    header: "Name",
    cell: (row) => row.name,
  },
  {
    header: "Email",
    cell: (row) => row.email,
  },
  {
    header: "Position",
    cell: (row) => row.position,
  },
];

const mockData: TestCandidate[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    position: "Frontend Developer",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    position: "Backend Developer",
  },
];

describe("CandidateTable", () => {
  it("renders table headers", () => {
    const onAction = vi.fn();

    render(
      <CandidateTable
        data={mockData}
        columns={mockColumns}
        actionLabel="Review"
        onAction={onAction}
      />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Position")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders table rows with data", () => {
    const onAction = vi.fn();

    render(
      <CandidateTable
        data={mockData}
        columns={mockColumns}
        actionLabel="Review"
        onAction={onAction}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
  });

  it("renders action buttons for each row", () => {
    const onAction = vi.fn();

    render(
      <CandidateTable
        data={mockData}
        columns={mockColumns}
        actionLabel="Review"
        onAction={onAction}
      />,
    );

    const buttons = screen.getAllByRole("button", { name: "Review" });
    expect(buttons).toHaveLength(2);
  });

  it("calls onAction with correct row data when button is clicked", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(
      <CandidateTable
        data={mockData}
        columns={mockColumns}
        actionLabel="Review"
        onAction={onAction}
      />,
    );

    const buttons = screen.getAllByRole("button", { name: "Review" });
    await user.click(buttons[0]);

    expect(onAction).toHaveBeenCalledWith(mockData[0]);
  });

  it("renders with custom action variant", () => {
    const onAction = vi.fn();

    render(
      <CandidateTable
        data={mockData}
        columns={mockColumns}
        actionLabel="View"
        actionVariant="outline"
        onAction={onAction}
      />,
    );

    const buttons = screen.getAllByRole("button", { name: "View" });
    expect(buttons).toHaveLength(2);
  });

  it("renders correct number of rows", () => {
    const onAction = vi.fn();

    render(
      <CandidateTable
        data={mockData}
        columns={mockColumns}
        actionLabel="Review"
        onAction={onAction}
      />,
    );

    const rows = screen.getAllByRole("row");
    // Including header row
    expect(rows).toHaveLength(3);
  });

  it("renders empty table when no data", () => {
    const onAction = vi.fn();

    render(
      <CandidateTable
        data={[]}
        columns={mockColumns}
        actionLabel="Review"
        onAction={onAction}
      />,
    );

    // Table header should still be rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});

describe("formatDate", () => {
  it("formats date string correctly", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toBe("2024-01-15");
  });

  it("handles Date object input", () => {
    const date = new Date(2024, 0, 15);
    const result = formatDate(date);
    expect(result).toBe("2024-01-15");
  });
});
