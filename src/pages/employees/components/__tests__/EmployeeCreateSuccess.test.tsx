// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "@/components/ui/dialog";
import { EmployeeCreateSuccess } from "../EmployeeCreateSuccess";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock DialogContent to render children directly if needed, or rely on real implementation.
// However, Radix UI Dialog requires a Portal which might be tricky in tests without setup.
// But standard testing-library render usually handles it if environment is jsdom.
// Let's try wrapping with real Dialog first.

// We need to mock resizeobserver for some radix components if they use it
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe("EmployeeCreateSuccess", () => {
  const mockOnClose = vi.fn();
  const mockPassword = "temporary-password-123";

  it("renders success dialog with password", () => {
    render(
      <Dialog open={true}>
        <EmployeeCreateSuccess
          createdPassword={mockPassword}
          onClose={mockOnClose}
        />
      </Dialog>,
    );

    expect(screen.getByText("employees.createSuccess")).toBeInTheDocument();
    expect(screen.getByText(mockPassword)).toBeInTheDocument();
    expect(screen.getByText("common.done")).toBeInTheDocument();
  });

  it("calls onClose when 'Done' button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog open={true}>
        <EmployeeCreateSuccess
          createdPassword={mockPassword}
          onClose={mockOnClose}
        />
      </Dialog>,
    );

    // Dialog content might be rendered in a portal, so we need to be careful with selectors.
    // By default Radix renders in a Portal.
    // Testing Library's `screen` queries the document.body, so it should find it.

    const doneButton = await screen.findByText("common.done");
    await user.click(doneButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("copies password to clipboard when copy button is clicked", async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn();

    // Mock clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });

    render(
      <Dialog open={true}>
        <EmployeeCreateSuccess
          createdPassword={mockPassword}
          onClose={mockOnClose}
        />
      </Dialog>,
    );

    // Find the copy button
    // The dialog close button (X) might be there too.
    // We want the button that is NOT "Done" and NOT the close "X" (usually has sr-only text or specific class).
    // The copy button is inside the div with the password.
    // Let's assume it's the one with the icon, but we can't easily select by icon.
    // However, it's the only other button in the main content area besides "Done".
    // Radix Dialog also adds a Close button.

    // Let's refine selection:
    // The copy button is next to the password text.
    const passwordElement = screen.getByText(mockPassword);
    const container = passwordElement.parentElement;
    const copyButton = container?.querySelector("button");

    if (copyButton) {
      await user.click(copyButton);
      expect(writeTextMock).toHaveBeenCalledWith(mockPassword);
    } else {
      throw new Error("Copy button not found");
    }
  });
});
