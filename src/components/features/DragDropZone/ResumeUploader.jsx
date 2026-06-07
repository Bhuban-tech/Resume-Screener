import { useResumeStore } from '../../../stores/resumeStore.js';
import DragDropZone from './DragDropZone.jsx';
import FileList from './FileList.jsx';

export default function ResumeUploader({ disabled }) {
  const { resumes, addResumes, removeResume } = useResumeStore();
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-white/5 pb-4 mb-2">
        <h3 className="font-syne text-sm sm:text-base font-bold text-white uppercase tracking-wider">Candidate Resumes</h3>
        <p className="text-[10px] sm:text-xs text-[#6b6b85] mt-1">Upload files to evaluate against config details</p>
      </div>
      <DragDropZone onDrop={addResumes} disabled={disabled} />
      <FileList files={resumes} onRemove={removeResume} disabled={disabled} />
    </div>
  );
}
