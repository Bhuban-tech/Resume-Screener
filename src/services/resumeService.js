/**
 * resumeService.js
 *
 * Individual resume CRUD operations.
 * All HTTP calls go through the shared apiClient so interceptors
 * apply uniformly and errors are pre-normalized.
 */
import { apiClient } from './api/apiClient.js';
import { SKILL_LIST } from '../utils/constants.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function roundScore(value) {
  if (value == null || Number.isNaN(Number(value))) return 0;
  return Math.round(Number(value));
}

/**
 * Maps a raw backend DTO to the shape the UI expects.
 * @param {object} dto
 * @param {number} index - zero-based index used for fallback candidate name
 */
export function mapBackendResponse(dto, index = 0) {
  const scores = dto.scores || {};
  return {
    resumeId:               dto.resumeId,
    candidateName:          dto.candidateName || `Candidate ${index + 1}`,
    email:                  dto.candidateEmail || '',
    phone:                  dto.candidatePhone || '',
    fileName:               dto.fileName || '',
    skillScore:             roundScore(scores.skill),
    experienceScore:        roundScore(scores.experience),
    educationScore:         roundScore(scores.education),
    totalScore:             roundScore(scores.total),
    matchedSkills:          dto.matchedSkills || [],
    missingSkills:          dto.missingSkills || [],
    missingMustHaveSkills:  dto.missingMustHaveSkills || dto.missingSkills || [],
    matchedOptionalSkills:  dto.matchedOptionalSkills || [],
    meetsMustHave:          dto.meetsMustHave !== false,
    status:                 dto.status || 'PENDING',
    recommendations:        dto.recommendations || [],
    experienceYears:        dto.experienceYears ?? null,
    education:              dto.education || '',
    screeningSessionId:     dto.screeningSessionId ?? null,
  };
}

/**
 * Extracts skills from a job description when the user has not listed them explicitly.
 * Matches against the canonical SKILL_LIST (aligned with backend SkillExtractorService).
 */
export function extractRequiredSkills(jobDescription, explicitSkills) {
  if (explicitSkills?.trim()) {
    return explicitSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const lower = jobDescription.toLowerCase();
  return SKILL_LIST.filter((skill) => lower.includes(skill.toLowerCase()));
}

// ─── API Calls ───────────────────────────────────────────────────────────────

/**
 * Fetches a single resume / candidate record by its database ID.
 * Normalizes the response through mapBackendResponse.
 */
export async function getResumeById(id) {
  const { data } = await apiClient.get(`/resumes/${id}`);
  return mapBackendResponse(data, 0);
}

/**
 * Updates the hiring status of a candidate (PENDING | SHORTLISTED | REJECTED).
 */
export async function updateCandidateStatus(id, status) {
  const { data } = await apiClient.patch(`/resumes/${id}/status`, { status });
  return mapBackendResponse(data, 0);
}

/**
 * Permanently deletes a resume record.
 * Returns the raw JSON response from the backend.
 */
export async function deleteResume(id) {
  const { data } = await apiClient.delete(`/resumes/${id}`);
  return data;
}
