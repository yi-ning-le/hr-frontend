export type CandidateStatus =
  | "new"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

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
  note: string;
  appliedAt: Date;
}
