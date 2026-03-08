// CandidateStatus is now dynamic, so we just use string.
// However, keeping the type alias helps with readability.
export type CandidateStatus = string;

export interface CandidateStatusDefinition {
  id: string;
  name: string;
  slug: string;
  type: "system" | "custom";
  sort_order: number;
  color: string;
}

export interface Candidate {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  experienceYears: number;
  education: string;
  appliedJobId: string;
  appliedJobTitle: string;
  channel: string; // e.g., "LinkedIn", "Referral", "Official Site"
  resumeUrl: string;
  status: CandidateStatus;
  note?: string;
  appliedAt: Date;
  reviewerId?: string;
  reviewerName?: string;
  reviewStatus?: string;
  reviewedAt?: string;
}

export type CommentType =
  | "normal"
  | "review_suitable"
  | "review_unsuitable"
  | "interview_pass"
  | "interview_fail";

export interface CandidateComment {
  id: string;
  candidateId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: "HR" | "INTERVIEWER";
  content: string; // Supports simplified Markdown
  commentType?: CommentType; // Defaults to "normal"
  createdAt: string; // ISO Date String
}
export interface CandidateListResponse {
  data: Candidate[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export type CandidateJobsCount = Record<string, number>;

export interface CandidateHistoryRecord {
  id?: string;
  candidateId: string;
  candidateName: string;
  status: CandidateStatus;
  reviewStatus: string;
  appliedAt: string;
  jobTitle: string;
}
