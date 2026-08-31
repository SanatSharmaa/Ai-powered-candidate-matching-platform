import { useState, useEffect, useCallback } from "react";
import api from "../api/client";
import { Job, PaginatedResponse, JobFiltersState } from "../types";

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  pagination: PaginatedResponse<Job>["pagination"] | null;
  fetchJobs: (page?: number) => Promise<void>;
}

export function useJobs(filters: JobFiltersState): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedResponse<Job>["pagination"] | null>(null);

  const fetchJobs = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, string | number> = { page, limit: 10 };

        if (filters.search) params.search = filters.search;
        if (filters.location) params.location = filters.location;
        if (filters.type) params.type = filters.type;
        if (filters.minSalary) params.minSalary = Number(filters.minSalary);
        if (filters.maxSalary) params.maxSalary = Number(filters.maxSalary);

        const res = await api.get<PaginatedResponse<Job>>("/jobs", { params });
        setJobs(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load jobs";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [filters.search, filters.location, filters.type, filters.minSalary, filters.maxSalary]
  );

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  return { jobs, loading, error, pagination, fetchJobs };
}
