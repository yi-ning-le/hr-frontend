// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GeneralSettings } from "../GeneralSettings";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue: string) => defaultValue,
  }),
}));

describe("GeneralSettings", () => {
  it("renders the placeholder text", () => {
    render(<GeneralSettings />);
    expect(
      screen.getByText("General Settings Placeholder"),
    ).toBeInTheDocument();
  });
});
