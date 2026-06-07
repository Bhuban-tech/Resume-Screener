import { exportToCSV } from '../../../utils/formatters.js';

export default function ExportButton({ results }) {
  return (
    <button
      type="button"
      onClick={() => exportToCSV(results)}
      disabled={!results || results.length === 0}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-[#1a1a26] text-xs font-semibold text-[#e8e8f0] hover:bg-white/[0.03] hover:border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    >
      <span>📥</span>
      Export CSV
    </button>
  );
}
