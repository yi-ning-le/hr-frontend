// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { HREmployee } from "@/lib/api";
import { HRTable } from "../HRTable";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
}));

const mockHrs: HREmployee[] = [
  {
    employeeId: "emp1",
    firstName: "John",
    lastName: "Doe",
    department: "HR",
  },
];

describe("HRTable", () => {
  it("renders the table with HR data", () => {
    render(
      <HRTable
        hrs={mockHrs}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    const hrTexts = screen.getAllByText("HR");
    expect(hrTexts).toHaveLength(2); // One for department, one for badge
    expect(hrTexts[1]).toHaveClass("bg-primary"); // Badge variant="default"
  });

  it("shows loading state", () => {
    const { container } = render(
      <HRTable
        hrs={[]}
        isLoading={true}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    const loader = container.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("shows empty state when no HRs", () => {
    render(
      <HRTable
        hrs={[]}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={false}
      />,
    );

    expect(
      screen.getByText("No HR employees assigned yet."),
    ).toBeInTheDocument();
  });

  it("calls onRevoke when revoke button is clicked", async () => {
    const onRevoke = vi.fn();
    const user = userEvent.setup();

    render(
      <HRTable
        hrs={mockHrs}
        isLoading={false}
        onRevoke={onRevoke}
        isRevoking={false}
      />,
    );

    const revokeButton = screen.getByRole("button");
    await user.click(revokeButton);

    expect(onRevoke).toHaveBeenCalledWith("emp1");
  });

  it("disables buttons when isRevoking is true", () => {
    render(
      <HRTable
        hrs={mockHrs}
        isLoading={false}
        onRevoke={() => {}}
        isRevoking={true}
      />,
    );

    const revokeButton = screen.getByRole("button");
    expect(revokeButton).toBeDisabled();
  });
});
