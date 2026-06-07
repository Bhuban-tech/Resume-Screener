import { formatFileSize } from '../../../utils/formatters.js';

export default function FileList({ files, onRemove, disabled }) {
  if (!files || files.length === 0) return null;
  return (
    <div className="flex flex-col gap-3 mt-1">
      <div className="flex items-center justify-between text-xs text-[#6b6b85] font-semibold uppercase tracking-wider">
        <span>Selected Files</span>
        <span className="text-[#4f6ef7]">({files.length} resume{files.length !== 1 ? 's' : ''})</span>
      </div>
      <div className="rounded-xl border border-white/5 bg-[#1a1a26]/20 divide-y divide-white/5 max-h-48 overflow-y-auto pr-1">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a26]/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl flex-shrink-0">📄</span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#e8e8f0] font-medium truncate">{file.name}</p>
                <p className="text-[10px] text-[#6b6b85] mt-0.5">{formatFileSize(file.size)}</p>
              </div>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-[#6b6b85] hover:text-[#ff5f57] transition-colors flex-shrink-0 ml-2 text-xl leading-none cursor-pointer p-1"
                title="Remove"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
