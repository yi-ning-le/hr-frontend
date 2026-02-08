import { vi } from "vitest";

// Mock react-i18next for tests
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      // Return the key with interpolated params for testing
      if (params) {
        return Object.entries(params).reduce(
          (acc, [k, v]) => acc.replace(`{{${k}}}`, v),
          key,
        );
      }
      return key;
    },
    i18n: {
      language: "zh-CN",
      changeLanguage: vi.fn(),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}));
