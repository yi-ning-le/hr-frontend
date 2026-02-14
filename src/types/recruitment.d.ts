export interface Interview {
  id: string;
  candidateId: string;
  candidateName?: string;
  candidateResumeUrl?: string;
  interviewerId: string;
  interviewerName?: string;
  jobId: string;
  jobTitle?: string;
  scheduledTime: string; // ISO date string
  scheduledEndTime: string; // ISO date string
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  snapshotStatus?: {
    key: string;
    label: string;
  };
}

export interface InterviewListResult {
  interviews: Interview[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateInterviewInput {
  candidateId: string;
  interviewerId: string;
  jobId: string;
  scheduledTime: Date;
  scheduledEndTime: Date;
}
