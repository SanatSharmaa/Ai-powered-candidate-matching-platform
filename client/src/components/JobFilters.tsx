import { JobFiltersState, JobType } from "../types";

interface JobFiltersProps {
  filters: JobFiltersState;
  onChange: (filters: JobFiltersState) => void;
  onReset: () => void;
}

export default function JobFilters({ filters, onChange, onReset }: JobFiltersProps) {
  const update = (field: keyof JobFiltersState, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  const jobTypes: { value: JobType | ""; label: string }[] = [
    { value: "", label: "All Types" },
    { value: "REMOTE", label: "Remote" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "ONSITE", label: "On-site" },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <button onClick={onReset} className="text-xs text-primary-600 hover:text-primary-700">
          Reset all
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="search" className="label">Search</label>
          <input
            id="search"
            type="text"
            className="input"
            placeholder="Job title, company, or keyword..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="location" className="label">Location</label>
          <input
            id="location"
            type="text"
            className="input"
            placeholder="City, state, or country..."
            value={filters.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="type" className="label">Work Type</label>
          <select
            id="type"
            className="input"
            value={filters.type}
            onChange={(e) => update("type", e.target.value)}
          >
            {jobTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="minSalary" className="label">Min Salary</label>
            <input
              id="minSalary"
              type="number"
              className="input"
              placeholder="e.g. 50000"
              value={filters.minSalary}
              onChange={(e) => update("minSalary", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="maxSalary" className="label">Max Salary</label>
            <input
              id="maxSalary"
              type="number"
              className="input"
              placeholder="e.g. 150000"
              value={filters.maxSalary}
              onChange={(e) => update("maxSalary", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
