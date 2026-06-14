/**
 * screeningService.js
 *
 * Batch-screening upload and async-polling logic.
 *
 * Flow:
 *  1. POST /api/screenings/upload  → returns ScreeningSessionDto (status: PROCESSING)
 *  2. Poll GET /api/screenings/{id} every POLL_INTERVAL_MS until status is COMPLETED or FAILED
 *  3. When COMPLETED, map each result through mapBackendResponse
 *
 * Long timeouts are set on the shared apiClient (5 min),
 * which is more than enough for a batch of 50 resumes.
 */
import { apiClient } from './api/apiClient.js';
import { mapBackendResponse } from './resumeService.js';

const POLL_INTERVAL_MS = 1500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Starts an async screening session.
 *
 * @param {File[]}   files            - Array of File objects (PDF/DOCX)
 * @param {string}   jobDescription   - Full job description text
 * @param {string}   jobTitle         - Display title for the job
 * @param {number}   minExperience    - Minimum years of experience required
 * @param {string}   mustHaveSkills   - Comma-separated must-have skills
 * @param {string}   optionalSkills   - Comma-separated nice-to-have skills
 * @param {number|null} existingJobId - ID of a previously saved job, if reusing
 * @param {function} onUploadProgress - Called with 0–30 as files upload
 * @returns {Promise<ScreeningSessionDto>} - The newly created session
 */
export async function startScreening(
  files,
  jobDescription,
  jobTitle,
  minExperience,
  mustHaveSkills,
  optionalSkills,
  existingJobId,
  onUploadProgress
) {
  const formData = new FormData();
  formData.append('jobTitle', jobTitle);
  formData.append('jobDescription', jobDescription);
  formData.append('minExperience', String(minExperience ?? 0));
  if (mustHaveSkills?.trim())  formData.append('mustHaveSkills', mustHaveSkills.trim());
  if (optionalSkills?.trim())  formData.append('optionalSkills', optionalSkills.trim());
  if (existingJobId)           formData.append('existingJobId', String(existingJobId));
  files.forEach((file) => formData.append('files', file));

  const { data } = await apiClient.post('/screenings/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (e.total && onUploadProgress) {
        onUploadProgress(Math.min(30, Math.round((e.loaded * 30) / e.total)));
      }
    },
  });

  return data;
}

/**
 * Polls GET /api/screenings/{id} until the session reaches a terminal state.
 *
 * @param {number}   screeningId  - The session ID returned by startScreening
 * @param {function} onProgress   - Called with (percentComplete 30–100, sessionData)
 * @returns {Promise<{ session, results }>}
 */
export async function pollScreeningUntilDone(screeningId, onProgress) {
  while (true) {
    const { data } = await apiClient.get(`/screenings/${screeningId}`);
    const pct = 30 + Math.round((data.progressPercent || 0) * 0.7);
    onProgress?.(pct, data);

    if (data.status === 'COMPLETED') {
      onProgress?.(100, data);
      const list = Array.isArray(data.results) ? data.results : [];
      return { session: data, results: list.map(mapBackendResponse) };
    }

    if (data.status === 'FAILED') {
      throw new Error(data.errorMessage || 'Screening failed on the server. Please try again.');
    }

    await sleep(POLL_INTERVAL_MS);
  }
}

/**
 * Returns all screening sessions for the history panel.
 * @returns {Promise<ScreeningSessionDto[]>}
 */
export async function listScreenings() {
  const { data } = await apiClient.get('/screenings');
  return Array.isArray(data) ? data : [];
}

/**
 * Returns a single screening session (used to reload past results).
 * @returns {Promise<ScreeningSessionDto>}
 */
export async function getScreening(id) {
  const { data } = await apiClient.get(`/screenings/${id}`);
  return data;
}
