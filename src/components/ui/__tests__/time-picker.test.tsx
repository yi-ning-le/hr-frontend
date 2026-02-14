// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimePicker } from "../time-picker";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock ResizeObserver
beforeEach(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("TimePicker", () => {
  it("renders correctly with placeholder", () => {
    render(<TimePicker placeholder="Select start time" />);

    expect(screen.getByText("Select start time")).toBeInTheDocument();
  });

  it("renders correctly with value", () => {
    render(<TimePicker value="14:30" />);

    expect(screen.getByText("14:30")).toBeInTheDocument();
  });

  it("renders disabled state", () => {
    render(<TimePicker disabled value="10:00" />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("opens popover when button is clicked", async () => {
    const user = userEvent.setup();
    render(<TimePicker placeholder="Select time" />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Popover should be open and show time columns
    expect(screen.getByText("common.confirm")).toBeInTheDocument();
    // Check for hour buttons (00-23) - using getAllByText since both hour and minute have 00
    const hour00 = screen
      .getAllByText("00")
      .find((el) => el.tagName === "BUTTON");
    expect(hour00).toBeInTheDocument();
    // Check for hour 23 (find first button with "23")
    const hour23 = screen
      .getAllByText("23")
      .find((el) => el.tagName === "BUTTON");
    expect(hour23).toBeInTheDocument();
    // Check for minute buttons (00-59)
    expect(screen.getByText("59")).toBeInTheDocument();
  });

  it("selects hour and minute and confirms", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onChange={onChange} />);

    // Open popover
    const button = screen.getByRole("button");
    await user.click(button);

    // Select hour (09) - get first one (hours column comes first)
    const hourButtons = screen.getAllByText("09");
    await user.click(hourButtons[0]);

    // Select minute (30) - scroll area renders all minutes
    const minute30 = screen.getByText("30");
    await user.click(minute30);

    // Confirm selection
    const confirmButton = screen.getByRole("button", {
      name: "common.confirm",
    });
    await user.click(confirmButton);

    expect(onChange).toHaveBeenCalledWith("09:30");
  });

  it("disables times before minTime", async () => {
    const user = userEvent.setup();
    render(<TimePicker minTime="14:00" />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Hour "13" should be disabled (rendered as span, not button)
    const hour13Elements = screen.getAllByText("13");
    // At least one should be a span (disabled)
    const disabledHour13 = hour13Elements.find((el) => el.tagName === "SPAN");
    expect(disabledHour13).toBeInTheDocument();
    expect(disabledHour13).toHaveClass("opacity-50");

    // Hour "14" should be clickable (button)
    const hour14Buttons = screen.getAllByText("14");
    const enabledHour14 = hour14Buttons.find((el) => el.tagName === "BUTTON");
    expect(enabledHour14).toBeInTheDocument();
  });

  it("disables confirm button when no time is selected", async () => {
    const user = userEvent.setup();
    render(<TimePicker />);

    const button = screen.getByRole("button");
    await user.click(button);

    const confirmButton = screen.getByRole("button", {
      name: "common.confirm",
    });
    expect(confirmButton).toBeDisabled();
  });

  it("prefills with selected value when opening", async () => {
    const user = userEvent.setup();
    render(<TimePicker value="10:30" />);

    const button = screen.getByRole("button");
    await user.click(button);

    // "10" should be selected (have bg-primary class)
    const hour10 = screen
      .getAllByText("10")
      .find((el) => el.classList.contains("bg-primary"));
    expect(hour10).toBeInTheDocument();

    // "30" should be selected
    const minute30 = screen
      .getAllByText("30")
      .find((el) => el.classList.contains("bg-primary"));
    expect(minute30).toBeInTheDocument();
  });

  it("closes popover after confirming", async () => {
    const user = userEvent.setup();
    render(<TimePicker onChange={vi.fn()} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Popover should be open
    expect(screen.getByText("common.confirm")).toBeInTheDocument();

    // Select time (get first button of each)
    await user.click(screen.getAllByText("15")[0]);
    await user.click(screen.getByText("45"));

    // Confirm
    const confirmButton = screen.getByRole("button", {
      name: "common.confirm",
    });
    await user.click(confirmButton);

    // Popover should be closed
    expect(screen.queryByText("common.confirm")).not.toBeInTheDocument();
  });
});
