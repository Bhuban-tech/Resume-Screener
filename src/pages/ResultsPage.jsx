import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useResumeStore } from '../stores/resumeStore.js';
import { getResumeById } from '../services/resumeService.js';
import ScoreBadge from '../components/features/results/ScoreBadge.jsx';
import CandidateStatusActions from '../components/features/results/CandidateStatusActions.jsx';
import Container from '../components/layout/Container.jsx';
import { getRankDisplay, getScoreColor } from '../utils/formatters.js';

export default function ResultsPage() {
  const { resumeId } = useParams();
  const id = Number.parseInt(resumeId, 10);
  const [, navigate] = useLocation();
  const { results, updateResultStatus } = useResumeStore();
  const fromStore = results.find((r) => r.resumeId === id);

  const [candidate, setCandidate] = useState(fromStore ?? null);
  const [loading, setLoading] = useState(!fromStore && !Number.isNaN(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fromStore) {
      setCandidate(fromStore);
      setLoading(false);
      return;
    }
    if (Number.isNaN(id)) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getResumeById(id)
      .then((data) => {
        if (!cancelled) {
          const rank = results.findIndex((r) => r.resumeId === id) + 1;
          setCandidate({ ...data, rank: rank > 0 ? rank : undefined });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load candidate');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, fromStore, results]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#6b6b85]">
          <span className="inline-block w-8 h-8 border-2 border-[#4f6ef7] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs sm:text-sm font-medium">Loading candidate details from database…</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center max-w-md px-6 bg-[#111118] border border-white/5 p-8 rounded-3xl">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-[#e8e8f0] font-medium text-base mb-2">{error || 'Candidate details not found'}</p>
          <p className="text-xs text-[#6b6b85] mb-6">The resume may have been deleted or the id is invalid.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#4f6ef7] hover:bg-[#5f7eff] text-white text-xs font-medium px-6 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const scoreBreakdown = [
    { label: 'Skill Match', value: candidate.skillScore, weight: '60%', color: 'bg-[#4f6ef7]', barColor: 'from-[#4f6ef7] to-[#4f6ef7]/80' },
    { label: 'Experience', value: candidate.experienceScore, weight: '30%', color: 'bg-[#a855f7]', barColor: 'from-[#a855f7] to-[#a855f7]/80' },
    { label: 'Education', value: candidate.educationScore, weight: '10%', color: 'bg-emerald-500', barColor: 'from-emerald-500 to-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0] py-10">
      <Container>
        {/* Back Link */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs sm:text-sm text-[#6b6b85] hover:text-white mb-8 transition-colors cursor-pointer"
        >
          <span>←</span> Back to Dashboard
        </button>

        {/* Profile Card Banner */}
        <div className="bg-[#111118]/50 border border-white/5 rounded-[24px] p-6 sm:p-8 mb-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
              {candidate.rank ? getRankDisplay(candidate.rank) : '👤'}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-syne text-2xl font-bold text-white tracking-tight">{candidate.candidateName}</h1>
                <ScoreBadge score={candidate.totalScore} showLabel />
                
                {!candidate.meetsMustHave && (
                  <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-[#ff5f57]/10 text-[#ff5f57] border border-[#ff5f57]/20 shadow-[0_0_10px_rgba(255,95,87,0.1)]">
                    Must-have skills not met
                  </span>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="mt-4 mb-4 border-t border-white/5 pt-4">
                <CandidateStatusActions
                  resumeId={candidate.resumeId}
                  status={candidate.status}
                  onStatusChange={(updated) => {
                    setCandidate((c) => ({ ...c, status: updated.status }));
                    updateResultStatus(candidate.resumeId, { status: updated.status });
                  }}
                />
              </div>

              {/* Metadata Sub-Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-[#6b6b85] mt-4">
                {candidate.email && (
                  <p className="flex items-center gap-2 bg-[#1a1a26]/40 border border-white/5 rounded-full px-3 py-1.5 w-fit">
                    <span>✉️</span> {candidate.email}
                  </p>
                )}
                {candidate.phone && (
                  <p className="flex items-center gap-2 bg-[#1a1a26]/40 border border-white/5 rounded-full px-3 py-1.5 w-fit">
                    <span>📞</span> {candidate.phone}
                  </p>
                )}
                {candidate.fileName && (
                  <p className="flex items-center gap-2 bg-[#1a1a26]/40 border border-white/5 rounded-full px-3 py-1.5 w-fit overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                    <span>📄</span> {candidate.fileName}
                  </p>
                )}
                {candidate.experienceYears != null && (
                  <p className="flex items-center gap-2 bg-[#1a1a26]/40 border border-white/5 rounded-full px-3 py-1.5 w-fit">
                    <span>💼</span> {candidate.experienceYears} Year{candidate.experienceYears !== 1 ? 's' : ''} Experience
                  </p>
                )}
                {candidate.education && (
                  <p className="flex items-center gap-2 bg-[#1a1a26]/40 border border-white/5 rounded-full px-3 py-1.5 w-fit">
                    <span>🎓</span> Highest: {candidate.education}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Breakdown & Recommendations Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          
          {/* Detailed Scores breakdown */}
          <div className="bg-[#111118]/50 border border-white/5 rounded-[24px] p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-syne text-base sm:text-lg font-bold text-white tracking-tight mb-6">Candidate Score Breakdown</h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center justify-center gap-2 py-4 bg-[#1a1a26]/30 border border-white/5 rounded-2xl">
                <div className="text-5xl font-syne font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-[#4f6ef7] bg-clip-text text-transparent">{candidate.totalScore}%</div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#4f6ef7]">Total Overall Score</div>
              </div>
              
              <div className="flex flex-col gap-5 pt-2">
                {scoreBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-xs sm:text-sm font-medium text-white/90">{item.label}</span>
                        <span className="text-[10px] text-[#6b6b85] font-normal">({item.weight} weight)</span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">{item.value}%</span>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="w-full bg-[#1a1a26] border border-white/5 rounded-full h-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.barColor} transition-all`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations block */}
          <div className="bg-[#111118]/50 border border-white/5 rounded-[24px] p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-syne text-base sm:text-lg font-bold text-white tracking-tight mb-6">Recommendations & Feedback</h2>
            
            {candidate.recommendations && candidate.recommendations.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {candidate.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-amber-500/[0.04] rounded-2xl border border-amber-500/10"
                  >
                    <span className="text-amber-400 flex-shrink-0 text-base">💡</span>
                    <p className="text-xs sm:text-sm text-amber-300/90 leading-relaxed font-normal">{rec}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-10 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl">
                <span className="text-3xl">🌟</span>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium">Strong candidate — meets all required parameters!</p>
              </div>
            )}
          </div>
        </div>

        {/* Matched vs Missing Skills section */}
        <div className="grid sm:grid-cols-2 gap-6">
          
          {/* Matched Skills Card */}
          <div className="bg-[#111118]/50 border border-white/5 rounded-[24px] p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne text-sm sm:text-base font-bold text-white tracking-tight">Matched Skills</h2>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2.5 py-0.5">
                {(candidate.matchedSkills || []).length} Detected
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
              {(candidate.matchedSkills || []).map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.02)]"
                >
                  {skill}
                </span>
              ))}
              {!candidate.matchedSkills?.length && (
                <p className="text-xs text-[#6b6b85] font-medium py-4 pl-1">No matched skills detected in resume content.</p>
              )}
            </div>
          </div>

          {/* Missing Skills Card */}
          <div className="bg-[#111118]/50 border border-white/5 rounded-[24px] p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne text-sm sm:text-base font-bold text-white tracking-tight">Missing Required Skills</h2>
              <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${
                (candidate.missingSkills || []).length > 0
                  ? 'text-[#ff5f57] bg-[#ff5f57]/10 border border-[#ff5f57]/25'
                  : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/25'
              }`}>
                {(candidate.missingSkills || []).length} Missing
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
              {(candidate.missingSkills || []).map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.02] text-[#6b6b85] border border-white/5"
                >
                  {skill}
                </span>
              ))}
              {!candidate.missingSkills?.length && (
                <div className="w-full flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4">
                  <span>✨</span>
                  <span>Perfect Match! Meets all configured required skills.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
