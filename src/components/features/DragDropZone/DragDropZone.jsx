import { useDropzone } from 'react-dropzone';
import { UPLOAD_CONFIG } from '../../../config/index.js';

export default function DragDropZone({ onDrop, disabled }) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: UPLOAD_CONFIG.acceptedTypes,
    maxSize: UPLOAD_CONFIG.maxSizeMB * 1024 * 1024,
    maxFiles: UPLOAD_CONFIG.maxFiles,
    disabled,
  });

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
          disabled
            ? 'opacity-40 cursor-not-allowed border-white/5 bg-[#1a1a26]/20'
            : isDragActive
            ? 'border-[#4f6ef7] bg-[#4f6ef7]/10 scale-[1.01] shadow-[0_0_30px_rgba(79,110,247,0.15)]'
            : 'border-white/10 bg-[#1a1a26]/40 hover:border-[#4f6ef7]/50 hover:bg-[#4f6ef7]/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className={`text-4xl transition-transform duration-300 ${isDragActive ? 'scale-110 translate-y-[-2px]' : ''}`}>
            {isDragActive ? '📂' : '📤'}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {isDragActive ? 'Drop the resumes here!' : 'Drag & drop candidate resumes'}
            </p>
            <p className="text-[10px] sm:text-xs text-[#6b6b85] mt-1">
              or <span className="text-[#4f6ef7] font-semibold hover:text-[#5f7eff] transition-colors">click to browse local files</span>
            </p>
          </div>
          <p className="text-[10px] text-[#6b6b85]">
            Supports PDF and DOCX · Max {UPLOAD_CONFIG.maxSizeMB}MB · Screen up to {UPLOAD_CONFIG.maxFiles} resumes
          </p>
        </div>
      </div>
      
      {fileRejections.length > 0 && (
        <div className="rounded-xl bg-[#ff5f57]/10 border border-[#ff5f57]/20 px-4 py-3 shadow-lg shadow-[#ff5f57]/5">
          {fileRejections.map(({ file, errors }) => (
            <p key={file.name} className="text-[10px] sm:text-xs text-[#ff5f57] font-medium leading-relaxed">
              <strong>{file.name}:</strong> {errors.map((e) => e.message).join(', ')}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
