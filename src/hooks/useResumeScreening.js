import { useResumeStore } from '../stores/resumeStore.js';
import { startScreening, pollScreeningUntilDone } from '../services/screeningService.js';
import { extractRequiredSkills } from '../services/resumeService.js';

export function useResumeScreening() {
  const { resumes, setResults, setLoading, setError, setUploadProgress } = useResumeStore();

  async function screen(
    jobDescription,
    jobTitle = 'Software Engineer',
    minExperience = 0,
    mustHaveSkills = '',
    optionalSkills = '',
    existingJobId = null
  ) {
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const resolvedMustHave = mustHaveSkills?.trim()
        ? mustHaveSkills
        : extractRequiredSkills(jobDescription, '').join(',');

      const session = await startScreening(
        resumes,
        jobDescription,
        jobTitle,
        minExperience,
        resolvedMustHave,
        optionalSkills,
        existingJobId,
        (pct) => setUploadProgress(pct)
      );

      const { results } = await pollScreeningUntilDone(session.id, (pct) =>
        setUploadProgress(pct)
      );

      const ranked = results.map((r, i) => ({ ...r, rank: i + 1 }));
      setResults(ranked);
      return { success: true, count: ranked.length, screeningId: session.id };
    } catch (err) {
      const msg = err.message || 'An unexpected error occurred.';
      setError(msg);
      return { error: msg };
    } finally {
      setLoading(false);
    }
  }

  return { screen };
}
