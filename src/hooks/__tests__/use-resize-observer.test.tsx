// @vitest-environment jsdom
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useResizeObserver } from "../use-resize-observer";
import { useRef } from "react";

describe("useResizeObserver", () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let callbackMock: ResizeObserverCallback;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();

    // Mock ResizeObserver
    vi.stubGlobal(
      "ResizeObserver",
      class ResizeObserver {
        constructor(callback: ResizeObserverCallback) {
          callbackMock = callback;
        }
        observe = observeMock;
        disconnect = disconnectMock;
        unobserve = vi.fn();
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return undefined dimensions initially", () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useResizeObserver(ref);
    });

    expect(result.current).toEqual({ width: undefined, height: undefined });
  });

  it("should observe the element when ref is set", () => {
    const element = document.createElement("div");

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(element);
      return useResizeObserver(ref);
    });

    expect(observeMock).toHaveBeenCalledWith(element);
  });

  it("should update size when ResizeObserver triggers", () => {
    const element = document.createElement("div");

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(element);
      return useResizeObserver(ref);
    });

    // Simulate resize event
    act(() => {
      if (callbackMock) {
        callbackMock(
          [
            {
              contentRect: { width: 100, height: 200 } as DOMRectReadOnly,
              target: element,
              borderBoxSize: [],
              contentBoxSize: [],
              devicePixelContentBoxSize: [],
            },
          ],
          {} as ResizeObserver,
        );
      }
    });

    expect(result.current).toEqual({ width: 100, height: 200 });
  });

  it("should disconnect observer on unmount", () => {
    const element = document.createElement("div");

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(element);
      return useResizeObserver(ref);
    });

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it("should handle null ref gracefully", () => {
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useResizeObserver(ref);
    });

    expect(observeMock).not.toHaveBeenCalled();
  });
});
