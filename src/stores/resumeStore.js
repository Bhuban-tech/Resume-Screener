/**
 * resumeStore.js
 *
 * Global Zustand store for the Resume Screener application.
 *
 * Manages:
 *  - Uploaded resume files
 *  - Screening results
 *  - Loading / error / progress states
 *  - Active screening session ID
 *  - Application-wide toast notifications
 */
import { create } from 'zustand';

let toastIdCounter = 0;

export const useResumeStore = create((set, get) => ({
  // ─── Files & Results ───────────────────────────────────────────────────────
  resumes: [],
  results: [],
  screeningSessionId: null,

  // ─── UI States ─────────────────────────────────────────────────────────────
  isLoading: false,
  error: null,
  uploadProgress: 0,

  // ─── Toasts ────────────────────────────────────────────────────────────────
  toasts: [],

  // ─── File Actions ──────────────────────────────────────────────────────────
  addResumes: (files) =>
    set((state) => ({
      resumes: [
        ...state.resumes,
        ...files.filter((f) => !state.resumes.find((r) => r.name === f.name)),
      ],
    })),

  removeResume: (index) =>
    set((state) => ({
      resumes: state.resumes.filter((_, i) => i !== index),
    })),

  // ─── Result Actions ────────────────────────────────────────────────────────
  setResults: (results) => set({ results }),

  setScreeningSessionId: (screeningSessionId) => set({ screeningSessionId }),

  updateResultStatus: (resumeId, patch) =>
    set((state) => ({
      results: state.results.map((r) =>
        r.resumeId === resumeId ? { ...r, ...patch } : r
      ),
    })),

  // ─── UI State Actions ──────────────────────────────────────────────────────
  setLoading:        (isLoading)      => set({ isLoading }),
  setError:          (error)          => set({ error }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),

  clearAll: () =>
    set({
      resumes:            [],
      results:            [],
      screeningSessionId: null,
      isLoading:          false,
      error:              null,
      uploadProgress:     0,
    }),

  // ─── Toast Actions ─────────────────────────────────────────────────────────
  /**
   * @param {'success'|'error'|'info'} type
   * @param {string} message
   * @param {number} [duration=4000] - auto-dismiss in ms
   */
  addToast: (type, message, duration = 4000) => {
    const id = ++toastIdCounter;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => get().dismissToast(id), duration);
    return id;
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// ─── Convenience helpers (call outside React without hooks) ──────────────────
export const toast = {
  success: (msg, duration) => useResumeStore.getState().addToast('success', msg, duration),
  error:   (msg, duration) => useResumeStore.getState().addToast('error',   msg, duration),
  info:    (msg, duration) => useResumeStore.getState().addToast('info',    msg, duration),
};
