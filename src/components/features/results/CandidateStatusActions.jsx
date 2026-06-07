import { useState } from 'react';
import { updateCandidateStatus } from '../../../services/resumeService.js';
import { CANDIDATE_STATUS } from '../../../config/index.js';

const ACTIVE_STYLES = {
  PENDING: 'bg-white/[0.04] text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.02)]',
  SHORTLISTED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.08)]',
  REJECTED: 'bg-[#ff5f57]/15 text-[#ff5f57] border-[#ff5f57]/30 shadow-[0_0_15px_rgba(255,95,87,0.08)]',
};

const INACTIVE_STYLES = {
  PENDING: 'border-white/5 text-[#6b6b85] hover:border-white/20 hover:text-white',
  SHORTLISTED: 'border-white/5 text-[#6b6b85] hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/5',
  REJECTED: 'border-white/5 text-[#6b6b85] hover:border-[#ff5f57]/30 hover:text-[#ff5f57] hover:bg-[#ff5f57]/5',
};

export default function CandidateStatusActions({ resumeId, status, onStatusChange }) {
  const [busy, setBusy] = useState(false);

  async function setStatus(next) {
    if (!resumeId || busy) return;
    setBusy(true);
    try {
      const updated = await updateCandidateStatus(resumeId, next);
      onStatusChange?.(updated);
    } catch {
      // parent handles errors
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {[CANDIDATE_STATUS.SHORTLISTED, CANDIDATE_STATUS.REJECTED, CANDIDATE_STATUS.PENDING].map((s) => {
        const isActive = status === s;
        return (
          <button
            key={s}
            type="button"
            disabled={busy || isActive}
            onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all duration-200 disabled:cursor-not-allowed cursor-pointer ${
              isActive ? ACTIVE_STYLES[s] : INACTIVE_STYLES[s]
            }`}
          >
            {s === 'SHORTLISTED' ? 'Shortlist' : s === 'REJECTED' ? 'Reject' : 'Pending'}
          </button>
        );
      })}
    </div>
  );
}
