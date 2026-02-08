import { beforeEach, describe, expect, it, vi } from "vitest";

// We need to mock the import.meta.env before importing i18n
vi.mock("i18next-browser-languagedetector", () => ({
  default: {
    type: "languageDetector",
    detect: () => "zh-CN",
    cacheUserLanguage: vi.fn(),
  },
}));

describe("i18n", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should export i18n instance", async () => {
    const { default: i18n } = await import("../i18n");
    expect(i18n).toBeDefined();
  });

  it("should have zh-CN and en-US languages configured", async () => {
    const { default: i18n } = await import("../i18n");
    const resources = i18n.options.resources;
    expect(resources).toHaveProperty("zh-CN");
    expect(resources).toHaveProperty("en-US");
  });

  it("should have zh-CN as fallback language", async () => {
    const { default: i18n } = await import("../i18n");
    expect(i18n.options.fallbackLng).toContain("zh-CN");
  });

  it("should have interpolation escapeValue set to false", async () => {
    const { default: i18n } = await import("../i18n");
    expect(i18n.options.interpolation?.escapeValue).toBe(false);
  });
});
