import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageSwitcher } from "../LanguageSwitcher";

// The i18n mock is already set up in test/i18n-mock.ts

describe("LanguageSwitcher", () => {
  it("renders the language switcher button", () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Switch language")).toBeInTheDocument();
  });

  it("shows language options when clicked", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Check for language options
    expect(screen.getByText("中文")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("closes dropdown when a language option is selected", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    // Open dropdown
    const button = screen.getByRole("button");
    await user.click(button);

    // Verify menu is open
    expect(screen.getByText("English")).toBeVisible();

    // Click English option
    const englishOption = screen.getByText("English");
    await user.click(englishOption);

    // Menu should close after selection - English text should no longer be visible
    // The dropdown menu items are removed from DOM when closed
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });

  it("displays flag emojis for each language", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("🇨🇳")).toBeInTheDocument();
    expect(screen.getByText("🇺🇸")).toBeInTheDocument();
  });
});
