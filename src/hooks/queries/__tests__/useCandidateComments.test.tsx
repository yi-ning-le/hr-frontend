// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommentsAPI } from "@/lib/api";
import {
  useAddCandidateComment,
  useCandidateComments,
  useDeleteCandidateComment,
} from "../useCandidateComments";

vi.mock("@/lib/api", () => ({
  CommentsAPI: {
    list: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useCandidateComments Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("useCandidateComments calls CommentsAPI.list", async () => {
    const mockComments = [
      { id: "1", content: "Great candidate", author: "User 1" },
    ];
    (CommentsAPI.list as any).mockResolvedValue(mockComments);

    const { result } = renderHook(() => useCandidateComments("candidate-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(CommentsAPI.list).toHaveBeenCalledWith("candidate-1");
    expect(result.current.data).toEqual(mockComments);
  });

  it("useCandidateComments returns empty when candidateId is empty", () => {
    const { result } = renderHook(() => useCandidateComments(""), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(CommentsAPI.list).not.toHaveBeenCalled();
  });

  it("useAddCandidateComment calls CommentsAPI.create", async () => {
    (CommentsAPI.create as any).mockResolvedValue({
      id: "1",
      content: "New comment",
    });

    const { result } = renderHook(() => useAddCandidateComment(), { wrapper });

    result.current.mutate({
      candidateId: "candidate-1",
      content: "New comment",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(CommentsAPI.create).toHaveBeenCalledWith(
      "candidate-1",
      "New comment",
    );
  });

  it("useDeleteCandidateComment calls CommentsAPI.delete", async () => {
    (CommentsAPI.delete as any).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useDeleteCandidateComment(), {
      wrapper,
    });

    result.current.mutate({
      commentId: "comment-1",
      candidateId: "candidate-1",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(CommentsAPI.delete).toHaveBeenCalledWith("comment-1");
  });
});
