import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCandidateStatuses } from "../useCandidateStatuses";
import { useCandidateStatusStore } from "@/stores/useCandidateStatusStore";

// Mock the store hook
vi.mock("@/stores/useCandidateStatusStore", () => ({
  useCandidateStatusStore: vi.fn(),
}));

describe("useCandidateStatuses", () => {
  const mockFetchStatuses = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch statuses if empty and not loading/error", () => {
    vi.mocked(useCandidateStatusStore).mockReturnValue({
      statuses: [],
      isLoading: false,
      error: null,
      fetchStatuses: mockFetchStatuses,
    } as unknown as ReturnType<typeof useCandidateStatusStore>);

    renderHook(() => useCandidateStatuses());

    expect(mockFetchStatuses).toHaveBeenCalledTimes(1);
  });

  it("should not fetch statuses if not empty", () => {
    vi.mocked(useCandidateStatusStore).mockReturnValue({
      statuses: [{ id: "1", name: "New" }],
      isLoading: false,
      error: null,
      fetchStatuses: mockFetchStatuses,
    } as unknown as ReturnType<typeof useCandidateStatusStore>);

    renderHook(() => useCandidateStatuses());

    expect(mockFetchStatuses).not.toHaveBeenCalled();
  });

  it("should not fetch if already loading", () => {
    vi.mocked(useCandidateStatusStore).mockReturnValue({
      statuses: [],
      isLoading: true,
      error: null,
      fetchStatuses: mockFetchStatuses,
    } as unknown as ReturnType<typeof useCandidateStatusStore>);

    renderHook(() => useCandidateStatuses());

    expect(mockFetchStatuses).not.toHaveBeenCalled();
  });

  it("should not fetch if there is an error", () => {
    vi.mocked(useCandidateStatusStore).mockReturnValue({
      statuses: [],
      isLoading: false,
      error: new Error("Failed"),
      fetchStatuses: mockFetchStatuses,
    } as unknown as ReturnType<typeof useCandidateStatusStore>);

    renderHook(() => useCandidateStatuses());

    expect(mockFetchStatuses).not.toHaveBeenCalled();
  });

  it("should only fetch once even if conditions persist across renders", () => {
    vi.mocked(useCandidateStatusStore).mockReturnValue({
      statuses: [],
      isLoading: false,
      error: null,
      fetchStatuses: mockFetchStatuses,
    } as unknown as ReturnType<typeof useCandidateStatusStore>);

    const { rerender } = renderHook(() => useCandidateStatuses());

    rerender();

    expect(mockFetchStatuses).toHaveBeenCalledTimes(1);
  });
});
