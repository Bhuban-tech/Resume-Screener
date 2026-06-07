import { useState } from 'react';
import { useLocation } from 'wouter';
import ScoreBadge from './ScoreBadge.jsx';
import ExportButton from './ExportButton.jsx';
import CandidateStatusActions from './CandidateStatusActions.jsx';
import { getRankDisplay } from '../../../utils/formatters.js';
import { FILTER_OPTIONS, SORT_OPTIONS, STATUS_FILTER_OPTIONS } from '../../../utils/constants.js';
import { useResumeStore } from '../../../stores/resumeStore.js';

const PAGE_SIZE = 10;

export default function ResultsTable({ results }) {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('score');
  const [page, setPage] = useState(1);
  const [, navigate] = useLocation();
  const { updateResultStatus } = useResumeStore();

  if (!results || results.length === 0) {
    return (
      <div className="rounded-[24px] border border-white/5 bg-[#111118]/50 p-12 text-center backdrop-blur-md">
        <p className="text-4xl mb-4">📊</p>
        <p className="text-[#e8e8f0] font-medium text-base">No candidates screened yet</p>
        <p className="text-xs text-[#6b6b85] mt-2">
          Configure a job profile, upload PDF/Word resumes, and click Start Screening.
        </p>
      </div>
    );
  }

  let filtered = results;
  if (filter === 'must-have') {
    filtered = filtered.filter((r) => r.meetsMustHave);
  } else if (filter !== 'all') {
    const minScore = Number.parseInt(filter, 10);
    filtered = filtered.filter((r) => r.totalScore >= minScore);
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter((r) => r.status === statusFilter);
  }

  const sorted = [...filtered].sort((a, b) =>
    sort === 'score' ? b.totalScore - a.totalScore : a.candidateName.localeCompare(b.candidateName)
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5">
      
      {/* Table Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111118]/30 border border-white/5 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f6ef7]" />
          <p className="text-xs sm:text-sm font-semibold text-white">
            Evaluation Results{' '}
            <span className="font-normal text-[#6b6b85] text-xs">
              ({filtered.length} of {results.length} candidates)
            </span>
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs bg-[#1a1a26] border border-white/5 rounded-xl px-3 py-2 text-[#e8e8f0] focus:outline-none focus:border-[#4f6ef7] cursor-pointer"
          >
            {FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs bg-[#1a1a26] border border-white/5 rounded-xl px-3 py-2 text-[#e8e8f0] focus:outline-none focus:border-[#4f6ef7] cursor-pointer"
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs bg-[#1a1a26] border border-white/5 rounded-xl px-3 py-2 text-[#e8e8f0] focus:outline-none focus:border-[#4f6ef7] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          
          <ExportButton results={filtered} />
        </div>
      </div>

      {/* Main Results Table Box */}
      <div className="rounded-[24px] border border-white/5 bg-[#111118]/50 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a26]/60 border-b border-white/5 text-[#6b6b85]">
                <th className="text-center px-4 py-4 text-[10px] font-bold uppercase tracking-wider w-16">
                  Rank
                </th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Candidate
                </th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Must-have status
                </th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Skills matched
                </th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider w-28">
                  Match score
                </th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider w-36">
                  Hiring status
                </th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider w-24">
                  Action
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {paginated.map((result, index) => {
                const globalRank = (page - 1) * PAGE_SIZE + index + 1;
                return (
                  <tr key={result.resumeId ?? globalRank} className="hover:bg-white/[0.02] transition-colors duration-200">
                    <td className="px-4 py-4 text-center font-semibold text-[#e8e8f0]">
                      {getRankDisplay(globalRank)}
                    </td>
                    
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white text-xs sm:text-sm">{result.candidateName}</p>
                      {result.email && <p className="text-[10px] text-[#6b6b85] mt-0.5">{result.email}</p>}
                      {!result.meetsMustHave && (
                        <p className="text-[10px] text-[#ff5f57] mt-1 font-medium bg-[#ff5f57]/5 border border-[#ff5f57]/15 rounded-full px-2 py-0.5 w-fit">
                          Missing must-have skills
                        </p>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      {result.meetsMustHave ? (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Met</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(result.missingMustHaveSkills || []).slice(0, 2).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ff5f57]/10 text-[#ff5f57] border border-[#ff5f57]/15"
                            >
                              {skill}
                            </span>
                          ))}
                          {(result.missingMustHaveSkills || []).length > 2 && (
                            <span className="text-[9px] text-[#6b6b85] self-center">
                              +{result.missingMustHaveSkills.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(result.matchedSkills || []).slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/5 text-emerald-400 border border-emerald-500/10"
                          >
                            {skill}
                          </span>
                        ))}
                        {(result.matchedSkills || []).length > 2 && (
                          <span className="text-[9px] text-[#6b6b85] self-center">
                            +{result.matchedSkills.length - 2} more
                          </span>
                        )}
                        {(result.matchedOptionalSkills || []).length > 0 && (
                          <span className="text-[9px] text-[#4f6ef7] self-center font-medium">
                            +{result.matchedOptionalSkills.length} nice-to-have
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <ScoreBadge score={result.totalScore} />
                    </td>
                    
                    <td className="px-4 py-4">
                      <CandidateStatusActions
                        resumeId={result.resumeId}
                        status={result.status}
                        onStatusChange={(updated) =>
                          updateResultStatus(result.resumeId, {
                            status: updated.status,
                          })
                        }
                      />
                    </td>
                    
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/results/${result.resumeId}`)}
                        disabled={!result.resumeId}
                        className="px-3 py-1.5 rounded-lg border border-[#4f6ef7]/40 text-[#4f6ef7] text-xs font-semibold hover:bg-[#4f6ef7]/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginator Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-4 py-4 border-t border-white/5 bg-[#1a1a26]/40">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-xs font-semibold rounded-lg border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 text-[#e8e8f0] cursor-pointer"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  p === page
                    ? 'bg-[#4f6ef7] text-white border-[#4f6ef7] shadow-[0_0_10px_rgba(79,110,247,0.3)]'
                    : 'border-white/5 text-[#6b6b85] hover:bg-white/5 hover:text-[#e8e8f0]'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-xs font-semibold rounded-lg border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 text-[#e8e8f0] cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
