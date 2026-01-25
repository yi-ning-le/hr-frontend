export interface JobPosition {
  id: string;
  title: string;
  department: string;
  headCount: number;
  openDate: Date;
  jobDescription: string;
  note?: string;
  status: "OPEN" | "CLOSED";
}
