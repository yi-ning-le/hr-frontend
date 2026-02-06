// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SettingsPage } from "../SettingsPage";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

describe("SettingsPage", () => {
  it("renders the settings page header", () => {
    render(<SettingsPage />);
    // "Settings" is the fallback or key for header.settings
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("is initially empty", () => {
    const { container } = render(<SettingsPage />);
    const content = container.querySelector(".settings-content");
    expect(content).toBeInTheDocument();
    expect(content).toBeEmptyDOMElement();
  });
});
