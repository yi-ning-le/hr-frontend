import type { Candidate } from "@/types/candidate";

interface CandidateOverrides extends Partial<Candidate> {
  id: string;
}

export function makeCandidate(overrides: CandidateOverrides): Candidate {
  return {
    id: overrides.id,
    name: overrides.name ?? "Candidate",
    email: overrides.email ?? "candidate@example.com",
    phone: overrides.phone ?? "000-000-0000",
    experienceYears: overrides.experienceYears ?? 0,
    education: overrides.education ?? "Unknown",
    appliedJobId: overrides.appliedJobId ?? "job-1",
    appliedJobTitle: overrides.appliedJobTitle ?? "Unknown",
    channel: overrides.channel ?? "Referral",
    resumeUrl: overrides.resumeUrl ?? "#",
    status: overrides.status ?? "new",
    note: overrides.note,
    appliedAt: overrides.appliedAt ?? new Date("2025-01-01T00:00:00.000Z"),
    reviewerId: overrides.reviewerId,
    reviewStatus: overrides.reviewStatus,
    reviewedAt: overrides.reviewedAt,
    avatar: overrides.avatar,
  };
}
