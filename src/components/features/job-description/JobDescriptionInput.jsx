export default function JobDescriptionInput({
  value,
  onChange,
  jobTitle,
  onJobTitleChange,
  minExperience,
  onMinExperienceChange,
  mustHaveSkills,
  onMustHaveSkillsChange,
  optionalSkills,
  onOptionalSkillsChange,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-white/5 pb-4 mb-2">
        <h3 className="font-syne text-sm sm:text-base font-bold text-white uppercase tracking-wider">Job Profile Configuration</h3>
        <p className="text-[10px] sm:text-xs text-[#6b6b85] mt-1">Configure criteria for candidate evaluation</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#6b6b85] uppercase tracking-wider">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
            placeholder="e.g. Senior Java Developer"
            className="w-full rounded-xl border border-white/5 bg-[#1a1a26]/40 px-4 py-3 text-xs sm:text-sm text-[#e8e8f0] placeholder-[#6b6b85] focus:outline-none focus:border-[#4f6ef7] focus:ring-1 focus:ring-[#4f6ef7]/50 transition-all duration-300"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#6b6b85] uppercase tracking-wider">Min. Experience (years)</label>
          <input
            type="number"
            min="0"
            max="20"
            value={minExperience}
            onChange={(e) => onMinExperienceChange(Number(e.target.value))}
            className="w-full rounded-xl border border-white/5 bg-[#1a1a26]/40 px-4 py-3 text-xs sm:text-sm text-[#e8e8f0] focus:outline-none focus:border-[#4f6ef7] focus:ring-1 focus:ring-[#4f6ef7]/50 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#6b6b85] uppercase tracking-wider flex items-center justify-between">
          <span>Must-have skills</span>
          <span className="text-[9px] font-normal text-amber-400 capitalize">Caps score at 49% if missing</span>
        </label>
        <input
          type="text"
          value={mustHaveSkills}
          onChange={(e) => onMustHaveSkillsChange(e.target.value)}
          placeholder="e.g. Java, Spring Boot, MySQL"
          className="w-full rounded-xl border border-white/5 bg-[#1a1a26]/40 px-4 py-3 text-xs sm:text-sm text-[#e8e8f0] placeholder-[#6b6b85] focus:outline-none focus:border-[#4f6ef7] focus:ring-1 focus:ring-[#4f6ef7]/50 transition-all duration-300"
        />
        <p className="text-[10px] text-[#6b6b85] leading-normal mt-0.5">
          Provide comma-separated skills. Candidates missing any of these will fail matching criteria.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#6b6b85] uppercase tracking-wider">Nice-to-have skills</label>
        <input
          type="text"
          value={optionalSkills}
          onChange={(e) => onOptionalSkillsChange(e.target.value)}
          placeholder="e.g. Docker, Kubernetes, AWS"
          className="w-full rounded-xl border border-white/5 bg-[#1a1a26]/40 px-4 py-3 text-xs sm:text-sm text-[#e8e8f0] placeholder-[#6b6b85] focus:outline-none focus:border-[#4f6ef7] focus:ring-1 focus:ring-[#4f6ef7]/50 transition-all duration-300"
        />
        <p className="text-[10px] text-[#6b6b85] leading-normal mt-0.5">Optional skills provide up to a 15% capped score bonus.</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#6b6b85] uppercase tracking-wider">Job Description</label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[10px] font-semibold text-[#6b6b85] hover:text-white transition-colors cursor-pointer"
            >
              Clear Area
            </button>
          )}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the full job description here — include target roles, key tools, and academic qualifications."
          style={{ minHeight: '120px' }}
          className="w-full resize-y rounded-xl border border-white/5 bg-[#1a1a26]/40 px-4 py-3 text-xs sm:text-sm text-[#e8e8f0] placeholder-[#6b6b85] focus:outline-none focus:border-[#4f6ef7] focus:ring-1 focus:ring-[#4f6ef7]/50 transition-all duration-300"
        />
        <p className="text-[10px] text-[#6b6b85] mt-0.5 flex justify-between">
          <span>{value ? `${value.length} characters` : 'Required - paste JD to start automatic extraction'}</span>
        </p>
      </div>
    </div>
  );
}
