import axios from 'axios';
import { API_BASE_URL } from '../config/index.js';
import { mapBackendResponse, getErrorMessage } from './resumeService.js';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  headers: { Accept: 'application/json' },
});

const POLL_INTERVAL_MS = 1500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/screenings/upload — returns session immediately (async)
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
  if (mustHaveSkills?.trim()) formData.append('mustHaveSkills', mustHaveSkills.trim());
  if (optionalSkills?.trim()) formData.append('optionalSkills', optionalSkills.trim());
  if (existingJobId) formData.append('existingJobId', String(existingJobId));
  files.forEach((file) => formData.append('files', file));

  try {
    const response = await client.post('/screenings/upload', formData, {
      onUploadProgress: (e) => {
        if (e.total && onUploadProgress) {
          onUploadProgress(Math.min(30, Math.round((e.loaded * 30) / e.total)));
        }
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

/**
 * Poll GET /api/screenings/{id} until COMPLETED or FAILED
 */
export async function pollScreeningUntilDone(screeningId, onProgress) {
  while (true) {
    const { data } = await client.get(`/screenings/${screeningId}`);
    const pct = 30 + Math.round((data.progressPercent || 0) * 0.7);
    onProgress?.(pct, data);

    if (data.status === 'COMPLETED') {
      onProgress?.(100, data);
      const list = Array.isArray(data.results) ? data.results : [];
      return { session: data, results: list.map(mapBackendResponse) };
    }
    if (data.status === 'FAILED') {
      throw new Error(data.errorMessage || 'Screening failed');
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

export async function listScreenings() {
  const { data } = await client.get('/screenings');
  return data;
}

export async function getScreening(id) {
  const { data } = await client.get(`/screenings/${id}`);
  return data;
}
