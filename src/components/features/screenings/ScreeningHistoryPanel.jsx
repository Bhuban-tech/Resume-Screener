import { useEffect, useState } from 'react';
import { listScreenings, getScreening } from '../../../services/screeningService.js';
import { mapBackendResponse } from '../../../services/resumeService.js';

export default function ScreeningHistoryPanel({ onLoadResults }) {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  function refresh() {
    setLoading(true);
    listScreenings()
      .then(setScreenings)
      .catch(() => setScreenings([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function loadSession(id) {
    setLoadingId(id);
    try {
      const session = await getScreening(id);
      if (session.status === 'COMPLETED' && session.results?.length) {
        const ranked = session.results.map(mapBackendResponse).map((r, i) => ({ ...r, rank: i + 1 }));
        onLoadResults?.(ranked);
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-[#6b6b85] font-semibold uppercase tracking-wider">
        <span>Screening Sessions</span>
        <button
          type="button"
          onClick={refresh}
          className="text-[#4f6ef7] hover:text-[#5f7eff] hover:underline cursor-pointer transition-colors text-[10px] font-semibold uppercase"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-[#6b6b85] py-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-[#4f6ef7] border-t-transparent rounded-full animate-spin" />
          <span>Fetching sessions…</span>
        </div>
      ) : screenings.length === 0 ? (
        <p className="text-[10px] text-[#6b6b85] leading-relaxed py-2">
          Your completed screening sessions will appear here to reload results.
        </p>
      ) : (
        <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 border border-white/5 rounded-xl p-2 bg-[#1a1a26]/20 pr-1">
          {screenings.slice(0, 15).map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={s.status !== 'COMPLETED' || loadingId === s.id}
              onClick={() => loadSession(s.id)}
              className="text-left text-xs px-3 py-2 rounded-lg hover:bg-white/[0.03] border border-transparent hover:border-white/5 disabled:opacity-40 transition-all cursor-pointer flex flex-col gap-1"
            >
              <div className="flex justify-between w-full">
                <span className="font-semibold text-white truncate max-w-[150px]">{s.jobTitle || 'Untitled job'}</span>
                <span className="text-[9px] text-[#6b6b85]">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</span>
              </div>
              <div className="flex justify-between w-full text-[10px] text-[#6b6b85]">
                <span>Status: <span className={s.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'}>{s.status}</span></span>
                <span>{s.processedFiles}/{s.totalFiles} files</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
