import axios from 'axios';
import { API_BASE_URL } from '../config/index.js';
import { getErrorMessage } from './resumeService.js';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { Accept: 'application/json' },
});

export async function listJobs() {
  try {
    const { data } = await client.get('/jobs');
    return data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export async function getJob(id) {
  try {
    const { data } = await client.get(`/jobs/${id}`);
    return data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}
