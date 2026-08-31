import { useState } from "react";
import api from "../api/client";

interface ApplicationFormProps {
  jobId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ApplicationForm({ jobId, onSuccess, onCancel }: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post(`/jobs/${jobId}/apply`, { coverLetter });
      onSuccess();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || "Failed to submit application");
      } else {
        setError("Failed to submit application");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mt-6">
      <h3 className="text-lg font-semibold text-gray-900">Apply for this position</h3>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="coverLetter" className="label">
          Cover Letter
        </label>
        <textarea
          id="coverLetter"
          className="input min-h-[160px] resize-y"
          placeholder="Tell the employer why you are a great fit for this role..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
          minLength={20}
        />
        <p className="mt-1 text-xs text-gray-400">Minimum 20 characters</p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={loading || coverLetter.length < 20}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
