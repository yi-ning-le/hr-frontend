import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CalendarTab } from "../CalendarTab";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

describe("CalendarTab", () => {
  it("renders calendar placeholder container", () => {
    render(<CalendarTab />);

    // Check the container has the expected content
    expect(screen.getByText("recruitment.calendar.title")).toBeInTheDocument();
  });

  it("renders title text", () => {
    render(<CalendarTab />);

    expect(screen.getByText("recruitment.calendar.title")).toBeInTheDocument();
  });

  it("renders placeholder description", () => {
    render(<CalendarTab />);

    expect(
      screen.getByText("recruitment.calendar.placeholder"),
    ).toBeInTheDocument();
  });

  it("renders with dashed border container", () => {
    const { container } = render(<CalendarTab />);

    // Verify the container exists with the expected structure
    const dashededBorderElement = container.querySelector(".border-dashed");
    expect(dashededBorderElement).toBeInTheDocument();
  });
});
