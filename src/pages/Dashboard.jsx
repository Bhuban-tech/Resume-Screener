import { useState } from 'react';
import { useResumeStore } from '../stores/resumeStore.js';
import { useResumeScreening } from '../hooks/useResumeScreening.js';
import ResumeUploader from '../components/features/DragDropZone/ResumeUploader.jsx';
import ResultsTable from '../components/features/results/ResultsTable.jsx';
import SavedJobsPanel from '../components/features/jobs/SavedJobsPanel.jsx';
import ScreeningHistoryPanel from '../components/features/screenings/ScreeningHistoryPanel.jsx';

export default function Dashboard() {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [minExperience, setMinExperience] = useState(0);
  const [mustHaveSkills, setMustHaveSkills] = useState('');
  const [optionalSkills, setOptionalSkills] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [toast, setToast] = useState(null);

  const { resumes, results, isLoading, error, uploadProgress, clearAll, setResults } = useResumeStore();
  const { screen } = useResumeScreening();

  function showToast(msg, type = 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  function handleSelectJob(job) {
    if (!job) { setSelectedJobId(null); return; }
    setSelectedJobId(job.id);
    setJobTitle(job.title || '');
    setJobDescription(job.description || '');
    setMinExperience(job.minExperience ?? 0);
    setMustHaveSkills(job.mustHaveSkills || '');
    setOptionalSkills(job.optionalSkills || '');
  }

  async function handleScreen() {
    if (!jobDescription.trim()) { showToast('Please paste a job description first.'); return; }
    if (resumes.length === 0) { showToast('Please upload at least one resume.'); return; }
    const res = await screen(jobDescription, jobTitle, minExperience, mustHaveSkills, optionalSkills, selectedJobId);
    if (res?.error) showToast(res.error);
    else showToast(`Screened ${res.count ?? resumes.length} resume(s) successfully!`, 'success');
  }

  return (
    <div style={{ padding: '40px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Dashboard Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
          Resume Screening Dashboard
        </h3>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          Saved jobs, async batch screening, must-have skills, PDF/DOCX uploads.
        </p>
        {(resumes.length > 0 || results.length > 0) && (
          <button
            type="button"
            onClick={clearAll}
            style={{
              marginTop: 8, fontSize: 11, color: 'var(--muted)', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: 8, padding: '6px 14px',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          marginBottom: 16, padding: '12px 18px', borderRadius: 12, fontSize: 13,
          background: toast.type === 'error' ? 'rgba(255,95,87,0.1)' : 'rgba(40,200,64,0.1)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(255,95,87,0.3)' : 'rgba(40,200,64,0.3)'}`,
          color: toast.type === 'error' ? '#ff5f57' : '#28c840',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Main Grid (matches the reference rs-dash-grid layout) */}
      <div className="rs-dash-grid">
        {/* Left: Form Card */}
        <div className="rs-form-card">
          {/* Job Title */}
          <div className="rs-field">
            <div className="rs-label">Job Title</div>
            <input
              className="rs-input"
              type="text"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              placeholder="e.g. Senior Java Developer"
              onInput={(e) => setJobTitle(e.target.value)}
            />
          </div>

          {/* Min Experience */}
          <div className="rs-field">
            <div className="rs-label">Min. Experience (years)</div>
            <input
              className="rs-input"
              type="number"
              min="0"
              max="20"
              value={minExperience}
              onInput={(e) => setMinExperience(Number(e.target.value))}
            />
          </div>

          {/* Must-have skills */}
          <div className="rs-field">
            <div className="rs-label">Must-have skills</div>
            <input
              className="rs-input"
              type="text"
              value={mustHaveSkills}
              onInput={(e) => setMustHaveSkills(e.target.value)}
              placeholder="e.g. Java, Spring Boot, MySQL"
            />
          </div>

          {/* Nice-to-have skills */}
          <div className="rs-field">
            <div className="rs-label">Nice-to-have skills</div>
            <input
              className="rs-input"
              type="text"
              value={optionalSkills}
              onInput={(e) => setOptionalSkills(e.target.value)}
              placeholder="e.g. Docker, Kubernetes, AWS"
            />
          </div>

          {/* Job Description */}
          <div className="rs-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="rs-label">Job Description</div>
              {jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  style={{ fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              className="rs-textarea"
              style={{ height: 100, resize: 'vertical' }}
              value={jobDescription}
              onInput={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here — include required skills, experience, and qualifications."
            />
            <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
              {jobDescription ? `${jobDescription.length} characters` : 'Required — paste JD to begin'}
            </p>
          </div>

          {/* Upload Resumes */}
          <div className="rs-field">
            <ResumeUploader disabled={isLoading} />
          </div>

          {/* Progress */}
          {isLoading && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                <span>Screening {resumes.length} file(s)…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: '100%', background: 'var(--card)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                <div style={{
                  width: `${uploadProgress}%`, height: '100%', borderRadius: 100,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                  transition: 'width 0.3s',
                }} />
              </div>
            </div>
          )}

          {/* Screen Button */}
          <button
            className="rs-btn-primary"
            style={{ width: '100%', padding: 14, opacity: isLoading ? 0.5 : 1 }}
            onClick={handleScreen}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Screening…' : '🔍 Start Screening'}
          </button>

          {/* Success / Error Messages */}
          {!isLoading && results.length > 0 && (
            <p style={{ fontSize: 12, color: '#28c840', marginTop: 12 }}>
              ✓ Successfully screened {results.length} candidate(s)
            </p>
          )}
          {error && (
            <p style={{ fontSize: 12, color: '#ff5f57', marginTop: 12 }}>
              Error: {error}
            </p>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="rs-sidebar">
          <div className="rs-sidebar-card">
            <h4>Saved Jobs</h4>
            <SavedJobsPanel selectedJobId={selectedJobId} onSelectJob={handleSelectJob} />
          </div>
          <div className="rs-sidebar-card">
            <h4>Screening History</h4>
            <ScreeningHistoryPanel onLoadResults={setResults} />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div style={{ marginTop: 30 }}>
        <ResultsTable results={results} />
      </div>
    </div>
  );
}
