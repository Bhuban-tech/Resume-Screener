import { create } from 'zustand';

export const useResumeStore = create((set) => ({
  resumes: [],
  results: [],
  isLoading: false,
  error: null,
  uploadProgress: 0,

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

  setResults: (results) => set({ results }),

  updateResultStatus: (resumeId, patch) =>
    set((state) => ({
      results: state.results.map((r) =>
        r.resumeId === resumeId ? { ...r, ...patch } : r
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),

  clearAll: () =>
    set({ resumes: [], results: [], isLoading: false, error: null, uploadProgress: 0 }),
}));
