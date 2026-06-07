// Dev: Vite proxies /api → http://localhost:8080 (see vite.config.js)
// Prod: set VITE_API_BASE_URL e.g. http://localhost:8080/api
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const UPLOAD_CONFIG = {
  acceptedTypes: {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxSizeMB: 10,
  maxFiles: 50,
};

export const CANDIDATE_STATUS = {
  PENDING: 'PENDING',
  SHORTLISTED: 'SHORTLISTED',
  REJECTED: 'REJECTED',
};
