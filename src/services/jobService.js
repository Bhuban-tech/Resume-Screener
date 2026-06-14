/**
 * jobService.js
 *
 * CRUD operations for saved job profiles.
 */
import { apiClient } from './api/apiClient.js';

/**
 * Returns all saved job configurations from the database.
 * @returns {Promise<JobDto[]>}
 */
export async function listJobs() {
  const { data } = await apiClient.get('/jobs');
  return Array.isArray(data) ? data : [];
}

/**
 * Returns a single job by ID.
 * @returns {Promise<JobDto>}
 */
export async function getJob(id) {
  const { data } = await apiClient.get(`/jobs/${id}`);
  return data;
}
