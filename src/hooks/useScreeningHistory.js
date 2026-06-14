/**
 * useScreeningHistory.js
 *
 * Manages the list of past screening sessions and provides
 * a loadSession helper that maps historical results into the
 * same shape used by useResumeScreening.
 */
import { useCallback, useEffect, useState } from 'react';
import { listScreenings, getScreening } from '../services/screeningService.js';
import { mapBackendResponse } from '../services/resumeService.js';

/**
 * @returns {{
 *   screenings: object[],
 *   loading:    boolean,
 *   error:      string|null,
 *   loadingId:  number|null,
 *   refresh:    () => void,
 *   loadSession: (id: number) => Promise<object[]|null>,
 * }}
 */
export function useScreeningHistory() {
  const [screenings, setScreenings] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [loadingId,  setLoadingId]  = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    listScreenings()
      .then((data) => { setScreenings(data); })
      .catch((err)  => { setError(err.message || 'Failed to load screening history.'); })
      .finally(()   => { setLoading(false); });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /**
   * Loads a completed screening session and returns ranked results.
   * Returns null if the session is not yet COMPLETED or has no results.
   */
  const loadSession = useCallback(async (id) => {
    setLoadingId(id);
    try {
      const session = await getScreening(id);
      if (session.status === 'COMPLETED' && session.results?.length) {
        const ranked = session.results
          .map(mapBackendResponse)
          .map((r, i) => ({ ...r, rank: i + 1 }));
        return ranked;
      }
      return null;
    } finally {
      setLoadingId(null);
    }
  }, []);

  return { screenings, loading, error, loadingId, refresh, loadSession };
}
