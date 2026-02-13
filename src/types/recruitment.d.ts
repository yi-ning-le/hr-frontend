export interface Interview {
  id: string;
  candidateId: string;
  interviewerId: string;
  jobId: string;
  scheduledTime: string; // ISO date string
  scheduledEndTime: string; // ISO date string
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface CreateInterviewInput {
  candidateId: string;
  interviewerId: string;
  jobId: string;
  scheduledTime: Date;
  scheduledEndTime: Date;
}
