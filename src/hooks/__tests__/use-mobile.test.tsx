// @vitest-environment jsdom
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIsMobile } from "../use-mobile";

describe("useIsMobile", () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;
  let mediaQueryListeners: Map<string, () => void>;

  beforeEach(() => {
    mediaQueryListeners = new Map();

    // Mock matchMedia
    window.matchMedia = vi.fn((query: string) => ({
      matches: window.innerWidth < 768,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event: string, handler: () => void) => {
        mediaQueryListeners.set(query, handler);
      }),
      removeEventListener: vi.fn(() => {
        mediaQueryListeners.delete(query);
      }),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, "innerWidth", {
      value: originalInnerWidth,
      writable: true,
    });
  });

  it("returns false on desktop viewport (>= 768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("returns true on mobile viewport (< 768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("returns true at boundary (767px)", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 767,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("returns false at exact breakpoint (768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 768,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("responds to viewport changes", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate resize to mobile
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 500,
        writable: true,
      });
      const handler = mediaQueryListeners.get("(max-width: 767px)");
      if (handler) handler();
    });

    expect(result.current).toBe(true);
  });
});
