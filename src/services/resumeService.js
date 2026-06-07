import axios from 'axios';
import { API_BASE_URL } from '../config/index.js';
import { SKILL_LIST } from '../utils/constants.js';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: { Accept: 'application/json' },
});

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

function roundScore(value) {
  if (value == null || Number.isNaN(Number(value))) return 0;
  return Math.round(Number(value));
}

export function mapBackendResponse(dto, index = 0) {
  const scores = dto.scores || {};
  return {
    resumeId: dto.resumeId,
    candidateName: dto.candidateName || `Candidate ${index + 1}`,
    email: dto.candidateEmail || '',
    phone: dto.candidatePhone || '',
    fileName: dto.fileName || '',
    skillScore: roundScore(scores.skill),
    experienceScore: roundScore(scores.experience),
    educationScore: roundScore(scores.education),
    totalScore: roundScore(scores.total),
    matchedSkills: dto.matchedSkills || [],
    missingSkills: dto.missingSkills || [],
    missingMustHaveSkills: dto.missingMustHaveSkills || dto.missingSkills || [],
    matchedOptionalSkills: dto.matchedOptionalSkills || [],
    meetsMustHave: dto.meetsMustHave !== false,
    status: dto.status || 'PENDING',
    recommendations: dto.recommendations || [],
    experienceYears: dto.experienceYears ?? null,
    education: dto.education || '',
    screeningSessionId: dto.screeningSessionId ?? null,
  };
}

export function getErrorMessage(err) {
  const data = err?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors)) return data.errors.join(', ');
  if (err?.message) return err.message;
  return 'Failed to reach the resume screening API.';
}

export async function getResumeById(id) {
  const response = await client.get(`/resumes/${id}`);
  return mapBackendResponse(response.data, 0);
}

export async function updateCandidateStatus(id, status) {
  const response = await client.patch(`/resumes/${id}/status`, { status });
  return mapBackendResponse(response.data, 0);
}

export async function deleteResume(id) {
  const response = await client.delete(`/resumes/${id}`);
  return response.data;
}
