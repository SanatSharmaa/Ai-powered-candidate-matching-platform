import { Link } from "react-router-dom";
import { Job } from "../types";

interface JobCardProps {
  job: Job;
}

const typeLabels: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

const typeBadgeColors: Record<string, string> = {
  REMOTE: "bg-green-100 text-green-700",
  HYBRID: "bg-yellow-100 text-yellow-700",
  ONSITE: "bg-blue-100 text-blue-700",
};

function formatSalary(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `$${value}`;
}

export default function JobCard({ job }: JobCardProps) {
  const posted = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link to={`/jobs/${job.id}`} className="card block transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{job.company}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${typeBadgeColors[job.type]}`}>
          {typeLabels[job.type]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          {posted}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.requirements.slice(0, 5).map((req, i) => (
          <span key={i} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {req}
          </span>
        ))}
        {job.requirements.length > 5 && (
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
            +{job.requirements.length - 5} more
          </span>
        )}
      </div>
    </Link>
  );
}
