import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value updates", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    );

    expect(result.current).toBe("initial");

    // Update value
    rerender({ value: "updated", delay: 500 });

    // Value should not be updated immediately
    expect(result.current).toBe("initial");

    // Fast-forward time, but not enough
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe("initial");

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Value should now be updated
    expect(result.current).toBe("updated");
  });

  it("should reset the delay if value changes again before timeout", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    );

    // Update value first time
    rerender({ value: "updated 1", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Update value second time before first delay completes
    rerender({ value: "updated 2", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Total time is 550ms since first update, but only 300ms since second update
    // Value should not be updated yet
    expect(result.current).toBe("initial");

    // Fast-forward remaining time for the second update
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("updated 2");
  });
});
