import { describe, it, expect, beforeEach } from "vitest";
import { useCandidateStore } from "../useCandidateStore";

describe("useCandidateStore", () => {
  beforeEach(() => {
    useCandidateStore.setState({
      selectedCandidateId: null,
      searchQuery: "",
      selectedJobId: "all",
      viewMode: "board",
      statusFilter: [],
    });
  });

  it("should select a candidate", () => {
    useCandidateStore.getState().selectCandidate("1");
    expect(useCandidateStore.getState().selectedCandidateId).toBe("1");
  });

  it("should set search query", () => {
    useCandidateStore.getState().setSearchQuery("test");
    expect(useCandidateStore.getState().searchQuery).toBe("test");
  });

  it("should set selected job id", () => {
    useCandidateStore.getState().setSelectedJobId("job1");
    expect(useCandidateStore.getState().selectedJobId).toBe("job1");
  });

  it("should set view mode", () => {
    useCandidateStore.getState().setViewMode("list");
    expect(useCandidateStore.getState().viewMode).toBe("list");
  });

  it("should set status filter", () => {
    useCandidateStore.getState().setStatusFilter(["new", "interview"]);
    expect(useCandidateStore.getState().statusFilter).toEqual([
      "new",
      "interview",
    ]);
  });
});
