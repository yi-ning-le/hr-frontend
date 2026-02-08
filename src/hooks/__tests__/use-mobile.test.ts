import { act, renderHook } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import { useIsMobile } from "../use-mobile";

describe("useIsMobile", () => {
  let matchMediaMock: Mock<(query: string) => MediaQueryList>;
  let cleanupMock: Mock<() => void>;

  beforeEach(() => {
    cleanupMock = vi.fn();
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: cleanupMock,
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = matchMediaMock as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return true when width is less than 768px", () => {
    // Set window width to mobile
    window.innerWidth = 500;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("should return false when width is greater than or equal to 768px", () => {
    // Set window width to desktop
    window.innerWidth = 1024;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("should handle resize events", () => {
    window.innerWidth = 1024;

    // We need to capture the event listener
    let changeListener: EventListener | null = null;
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((type, listener) => {
        if (type === "change") {
          changeListener = listener as EventListener;
        }
      }),
      removeEventListener: cleanupMock,
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resize to mobile
    act(() => {
      window.innerWidth = 500;
      if (changeListener) {
        // Trigger the listener
        (changeListener as (e: MediaQueryListEvent) => void)({
          matches: true,
        } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });
});
