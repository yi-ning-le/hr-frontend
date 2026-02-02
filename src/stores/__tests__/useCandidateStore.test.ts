import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCandidateStore } from "../useCandidateStore";
import { CandidatesAPI } from "@/lib/api";
import type { Candidate } from "@/types/candidate";

vi.mock("@/lib/api", () => ({
  CandidatesAPI: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateStatus: vi.fn(),
    updateNote: vi.fn(),
    uploadResume: vi.fn(),
  },
}));

describe("useCandidateStore", () => {
  const mockCandidate: Candidate = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    experienceYears: 5,
    education: "Bachelor in CS",
    appliedJobId: "job1",
    appliedJobTitle: "Software Engineer",
    channel: "LinkedIn",
    resumeUrl: "",
    status: "new",
    note: "",
    appliedAt: new Date("2023-01-01"),
  };

  beforeEach(() => {
    useCandidateStore.setState({
      candidates: [],
      selectedCandidateId: null,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe("fetchCandidates", () => {
    it("should fetch and set candidates", async () => {
      vi.mocked(CandidatesAPI.list).mockResolvedValue([mockCandidate]);

      await useCandidateStore.getState().fetchCandidates();

      expect(useCandidateStore.getState().candidates).toHaveLength(1);
      expect(useCandidateStore.getState().candidates[0]).toEqual(mockCandidate);
      expect(useCandidateStore.getState().isLoading).toBe(false);
    });

    it("should handle fetch errors", async () => {
      vi.mocked(CandidatesAPI.list).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await useCandidateStore.getState().fetchCandidates();

      expect(useCandidateStore.getState().error).toBe(
        "Failed to fetch candidates",
      );
      expect(useCandidateStore.getState().isLoading).toBe(false);
    });
  });

  describe("addCandidate", () => {
    it("should add a new candidate", async () => {
      const newCandidateData = { name: "Jane Doe" };
      const createdCandidate = {
        ...mockCandidate,
        ...newCandidateData,
        id: "2",
      };

      vi.mocked(CandidatesAPI.create).mockResolvedValue(createdCandidate);

      await useCandidateStore.getState().addCandidate(newCandidateData);

      expect(useCandidateStore.getState().candidates).toContainEqual(
        createdCandidate,
      );
    });

    it("should handle resume upload during creation", async () => {
      const newCandidateData = { name: "Jane Doe" };
      const intermediateCandidate = {
        ...mockCandidate,
        ...newCandidateData,
        id: "2",
      };
      const finalCandidate = { ...intermediateCandidate, resumeUrl: "url" };
      const file = new File([""], "resume.pdf");

      vi.mocked(CandidatesAPI.create).mockResolvedValue(intermediateCandidate);
      vi.mocked(CandidatesAPI.uploadResume).mockResolvedValue({
        candidate: finalCandidate,
        resumeUrl: "url",
      });

      await useCandidateStore.getState().addCandidate(newCandidateData, file);

      expect(CandidatesAPI.uploadResume).toHaveBeenCalledWith("2", file);
      expect(useCandidateStore.getState().candidates).toContainEqual(
        finalCandidate,
      );
    });
  });

  describe("updateCandidateStatus", () => {
    it("should update candidate status", async () => {
      useCandidateStore.setState({ candidates: [mockCandidate] });
      const updatedCandidate = {
        ...mockCandidate,
        status: "interview" as const,
      };

      vi.mocked(CandidatesAPI.updateStatus).mockResolvedValue(updatedCandidate);

      await useCandidateStore
        .getState()
        .updateCandidateStatus(mockCandidate.id, "interview");

      expect(useCandidateStore.getState().candidates[0].status).toBe(
        "interview",
      );
    });
  });

  describe("removeCandidate", () => {
    it("should remove candidate", async () => {
      useCandidateStore.setState({ candidates: [mockCandidate] });

      vi.mocked(CandidatesAPI.delete).mockResolvedValue(undefined);

      await useCandidateStore.getState().removeCandidate(mockCandidate.id);

      expect(useCandidateStore.getState().candidates).toHaveLength(0);
    });
  });
});
