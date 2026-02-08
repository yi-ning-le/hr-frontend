export interface Interview {
  id: string;
  candidateId: string;
  interviewerId: string;
  jobId: string;
  scheduledTime: string; // ISO date string
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
}

export interface CreateInterviewInput {
  candidateId: string;
  interviewerId: string;
  jobId: string;
  scheduledTime: Date;
  notes?: string;
}

export interface UpdateInterviewNotesInput {
  id: string;
  notes: string;
}
