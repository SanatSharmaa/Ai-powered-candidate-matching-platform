export type Role = "EMPLOYER" | "CANDIDATE";
export type JobType = "REMOTE" | "HYBRID" | "ONSITE";
export type ApplicationStatus = "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string[];
  employerId: string;
  employer: Pick<User, "id" | "name" | "email">;
  _count: { applications: number };
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  coverLetter: string;
  status: ApplicationStatus;
  candidateId: string;
  candidate: Pick<User, "id" | "name" | "email">;
  jobId: string;
  job: Job;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface JobFiltersState {
  search: string;
  location: string;
  type: JobType | "";
  minSalary: string;
  maxSalary: string;
}
