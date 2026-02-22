import { describe, expect, it } from "vitest";
import {
  filterReviewedCandidates,
  getCandidateReviewStatus,
  normalizeReviewedFilters,
} from "../reviewedFilters";
import type { ReviewedCandidateRow } from "../types";

const candidates: ReviewedCandidateRow[] = [
  {
    id: "1",
    name: "Alice Brown",
    appliedJobTitle: "Engineer",
    appliedAt: new Date("2025-01-05T00:00:00.000Z"),
    reviewStatus: "suitable",
    status: "interview",
    reviewedAt: "2025-01-10T14:30:00.000Z",
  },
  {
    id: "2",
    name: "Bob Wilson",
    appliedJobTitle: "Manager",
    appliedAt: new Date("2025-01-06T00:00:00.000Z"),
    reviewStatus: "rejected",
    status: "rejected",
    reviewedAt: "2025-01-11T09:15:00.000Z",
  },
  {
    id: "3",
    name: "Charlie Davis",
    appliedJobTitle: "Developer",
    appliedAt: new Date("2025-01-07T00:00:00.000Z"),
    status: "screening",
    reviewedAt: null,
  },
];

describe("reviewedFilters", () => {
  it("normalizes missing search params to defaults", () => {
    expect(normalizeReviewedFilters({}, ["suitable"])).toEqual({
      q: "",
      status: "all",
    });
  });

  it("falls back invalid status to all", () => {
    expect(
      normalizeReviewedFilters({ q: "Alice", status: "unknown" }, []),
    ).toEqual({
      q: "Alice",
      status: "all",
    });
  });

  it("keeps valid status from options", () => {
    expect(
      normalizeReviewedFilters({ q: "", status: "rejected" }, [
        "suitable",
        "rejected",
      ]),
    ).toEqual({
      q: "",
      status: "rejected",
    });
  });

  it("uses reviewStatus first and falls back to status", () => {
    expect(getCandidateReviewStatus(candidates[0])).toBe("suitable");
    expect(getCandidateReviewStatus(candidates[2])).toBe("screening");
  });

  it("filters by query and status together", () => {
    expect(
      filterReviewedCandidates(candidates, { q: "ali", status: "suitable" }),
    ).toEqual([candidates[0]]);
  });

  it("search is case-insensitive and matches job title", () => {
    expect(
      filterReviewedCandidates(candidates, { q: "developer", status: "all" }),
    ).toEqual([candidates[2]]);
  });
});
