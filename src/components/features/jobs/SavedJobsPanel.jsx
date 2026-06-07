import { useEffect, useState } from 'react';
import { listJobs } from '../../../services/jobService.js';

export default function SavedJobsPanel({ selectedJobId, onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-[#6b6b85] font-semibold uppercase tracking-wider">
        <span>Job History</span>
        <span className="text-[9px] font-normal text-[#4f6ef7]">Database Loaded</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-[#6b6b85] py-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-[#4f6ef7] border-t-transparent rounded-full animate-spin" />
          <span>Fetching job templates…</span>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-[10px] text-[#6b6b85] leading-relaxed py-2">
          Saved job configurations will show up here after your first screening run.
        </p>
      ) : (
        <select
          value={selectedJobId ?? ''}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null;
            const job = jobs.find((j) => j.id === id);
            onSelectJob?.(job ?? null);
          }}
          className="w-full text-xs sm:text-sm bg-[#1a1a26] border border-white/5 rounded-xl px-3 py-2.5 text-[#e8e8f0] focus:outline-none focus:border-[#4f6ef7] cursor-pointer"
        >
          <option value="">Start from Scratch (New Job)</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              💼 {job.title} ({job.screeningCount ?? 0} runs)
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
