import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SocialLoginButtons } from "../SocialLoginButtons";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "zh-CN", changeLanguage: vi.fn() },
  }),
}));

describe("SocialLoginButtons", () => {
  it("renders 'or continue with' divider text", () => {
    render(<SocialLoginButtons />);

    expect(screen.getByText("auth.social.orContinueWith")).toBeInTheDocument();
  });

  it("renders three social login buttons", () => {
    render(<SocialLoginButtons />);

    // Check for screen reader text for each button
    expect(screen.getByText("auth.social.wechat")).toBeInTheDocument();
    expect(screen.getByText("auth.social.dingtalk")).toBeInTheDocument();
    expect(screen.getByText("auth.social.feishu")).toBeInTheDocument();
  });

  it("shows coming soon text", () => {
    render(<SocialLoginButtons />);

    expect(screen.getByText("auth.social.comingSoon")).toBeInTheDocument();
  });

  it("disables buttons when disabled prop is passed", () => {
    render(<SocialLoginButtons disabled={true} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("buttons are enabled by default", () => {
    render(<SocialLoginButtons />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });
});
