import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type Interview,
  type CreateInterviewInput,
  type UpdateInterviewNotesInput,
} from "@/types/recruitment.d";
import { useAuthStore } from "@/stores/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function createInterview(data: CreateInterviewInput): Promise<Interview> {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${API_BASE_URL}/recruitment/interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create interview");
  }

  return response.json();
}

async function fetchMyInterviews(): Promise<Interview[]> {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${API_BASE_URL}/recruitment/interviews/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my interviews");
  }

  return response.json();
}

async function fetchInterview(id: string): Promise<Interview> {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${API_BASE_URL}/recruitment/interviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch interview");
  }

  return response.json();
}

async function updateInterviewNotes({
  id,
  notes,
}: UpdateInterviewNotesInput): Promise<Interview> {
  const token = useAuthStore.getState().token;
  const response = await fetch(
    `${API_BASE_URL}/recruitment/interviews/${id}/notes`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update interview notes");
  }

  return response.json();
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}

export function useMyInterviews() {
  return useQuery({
    queryKey: ["interviews", "me"],
    queryFn: fetchMyInterviews,
  });
}

export function useInterview(id: string) {
  return useQuery({
    queryKey: ["interviews", id],
    queryFn: () => fetchInterview(id),
    enabled: !!id,
  });
}

export function useUpdateInterviewNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInterviewNotes,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interviews", data.id] });
      queryClient.invalidateQueries({ queryKey: ["interviews", "me"] });
    },
  });
}
