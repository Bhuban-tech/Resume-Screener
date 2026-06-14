/**
 * useJobs.js
 *
 * Provides access to the saved-jobs list from the backend.
 * Automatically fetches on mount; exposes a refresh callback.
 */
import { useCallback, useEffect, useState } from 'react';
import { listJobs } from '../services/jobService.js';

/**
 * @returns {{
 *   jobs:    object[],
 *   loading: boolean,
 *   error:   string|null,
 *   refresh: () => void,
 * }}
 */
export function useJobs() {
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    listJobs()
      .then((data) => { setJobs(data); })
      .catch((err)  => { setError(err.message || 'Failed to load saved jobs.'); })
      .finally(()   => { setLoading(false); });
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { jobs, loading, error, refresh: fetch };
}
