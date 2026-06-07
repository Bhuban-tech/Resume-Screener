package com.resumescreener.service;

import com.resumescreener.dto.ResumeResponseDto;
import com.resumescreener.dto.ScoreDto;
import com.resumescreener.dto.SkillScoreBreakdown;
import com.resumescreener.dto.UploadRequestDto;
import com.resumescreener.entity.CandidateStatus;
import com.resumescreener.entity.JobDescription;
import com.resumescreener.entity.Resume;
import com.resumescreener.entity.ScreeningSession;
import com.resumescreener.exception.ResourceNotFoundException;
import com.resumescreener.repository.ResumeRepository;
import com.resumescreener.util.SkillListUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final DocumentParserService documentParserService;
    private final SkillExtractorService skillExtractorService;
    private final ScoringService scoringService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processResumeFile(String fileName,
                                   byte[] content,
                                   JobDescription job,
                                   ScreeningSession session,
                                   List<String> mustHaveSkills,
                                   List<String> optionalSkills) throws IOException {
        String text = documentParserService.extractText(fileName, content);

        String name = skillExtractorService.extractName(text);
        String email = skillExtractorService.extractEmail(text);
        String phone = skillExtractorService.extractPhone(text);
        int expYears = skillExtractorService.extractExperienceYears(text);
        String education = skillExtractorService.extractEducation(text);

        List<String> matchedSkills = skillExtractorService.extractSkills(text, mustHaveSkills, optionalSkills);

        SkillScoreBreakdown skillBreakdown = scoringService.calculateSkillScoreWithMustHave(
                mustHaveSkills, optionalSkills, matchedSkills);

        List<String> missingForDisplay = skillExtractorService.findMissingSkills(
                mustHaveSkills, matchedSkills);

        double experienceScore = scoringService.calculateExperienceScore(
                expYears, job.getMinExperience() != null ? job.getMinExperience() : 0);
        double educationScore = scoringService.calculateEducationScore(education);
        double totalScore = scoringService.calculateTotalScore(
                skillBreakdown.getSkillScore(), experienceScore, educationScore);

        List<String> recommendations = scoringService.generateRecommendations(
                skillBreakdown.getMissingMustHaveSkills(),
                skillBreakdown.getMatchedOptionalSkills(),
                expYears,
                job.getMinExperience() != null ? job.getMinExperience() : 0,
                education);

        Resume resume = Resume.builder()
                .fileName(fileName)
                .fileData(text)
                .candidateName(name)
                .candidateEmail(email)
                .candidatePhone(phone)
                .skills(String.join(",", matchedSkills))
                .experienceYears(expYears)
                .education(education)
                .skillScore(skillBreakdown.getSkillScore())
                .experienceScore(experienceScore)
                .educationScore(educationScore)
                .score(totalScore)
                .jobDescription(job)
                .screeningSession(session)
                .status(CandidateStatus.PENDING)
                .meetsMustHave(skillBreakdown.isMeetsMustHave())
                .matchedOptionalSkills(SkillListUtil.join(skillBreakdown.getMatchedOptionalSkills()))
                .build();
        resume = resumeRepository.save(resume);

        buildResponseDto(resume, matchedSkills, missingForDisplay,
                skillBreakdown.getMissingMustHaveSkills(),
                skillBreakdown.getMatchedOptionalSkills(),
                recommendations,
                skillBreakdown.getSkillScore(), experienceScore, educationScore, totalScore);
    }

    @Transactional(readOnly = true)
    public List<ResumeResponseDto> getResultsForSession(Long sessionId) {
        return resumeRepository.findByScreeningSessionIdOrderByScoreDesc(sessionId).stream()
                .map(this::toResponseFromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResumeResponseDto getResumeById(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));
        return toResponseFromEntity(resume);
    }

    public ResumeResponseDto updateStatus(Long id, String status) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + id));
        resume.setStatus(CandidateStatus.valueOf(status.toUpperCase()));
        resume = resumeRepository.save(resume);
        return toResponseFromEntity(resume);
    }

    public void deleteResume(Long id) {
        if (!resumeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resume not found with id: " + id);
        }
        resumeRepository.deleteById(id);
        log.info("Deleted resume with id: {}", id);
    }

    private ResumeResponseDto toResponseFromEntity(Resume resume) {
        List<String> matched = parseSkills(resume.getSkills());
        JobDescription job = resume.getJobDescription();

        List<String> mustHave = job != null
                ? SkillListUtil.parseCommaSeparated(
                        job.getMustHaveSkills() != null ? job.getMustHaveSkills() : job.getRequiredSkills())
                : List.of();
        List<String> optional = job != null
                ? SkillListUtil.parseCommaSeparated(job.getOptionalSkills())
                : List.of();

        List<String> missingMustHave = skillExtractorService.findMissingSkills(mustHave, matched);
        List<String> matchedOptional = parseSkills(resume.getMatchedOptionalSkills());
        List<String> recs = scoringService.generateRecommendations(
                missingMustHave,
                matchedOptional,
                resume.getExperienceYears() != null ? resume.getExperienceYears() : 0,
                job != null && job.getMinExperience() != null ? job.getMinExperience() : 0,
                resume.getEducation());

        return buildResponseDto(resume, matched, missingMustHave, missingMustHave, matchedOptional, recs,
                resume.getSkillScore(), resume.getExperienceScore(),
                resume.getEducationScore(), resume.getScore());
    }

    private List<String> parseSkills(String raw) {
        if (raw == null || raw.isBlank()) return List.of();
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private ResumeResponseDto buildResponseDto(Resume resume,
                                                  List<String> matched,
                                                  List<String> missing,
                                                  List<String> missingMustHave,
                                                  List<String> matchedOptional,
                                                  List<String> recommendations,
                                                  Double skillScore,
                                                  Double experienceScore,
                                                  Double educationScore,
                                                  Double totalScore) {
        return ResumeResponseDto.builder()
                .resumeId(resume.getId())
                .candidateName(resume.getCandidateName())
                .candidateEmail(resume.getCandidateEmail())
                .candidatePhone(resume.getCandidatePhone())
                .scores(ScoreDto.builder()
                        .skill(skillScore != null ? skillScore : 0)
                        .experience(experienceScore != null ? experienceScore : 0)
                        .education(educationScore != null ? educationScore : 0)
                        .total(totalScore != null ? totalScore : 0)
                        .build())
                .matchedSkills(matched)
                .missingSkills(missing)
                .recommendations(recommendations)
                .fileName(resume.getFileName())
                .experienceYears(resume.getExperienceYears())
                .education(resume.getEducation())
                .status(resume.getStatus() != null ? resume.getStatus().name() : CandidateStatus.PENDING.name())
                .meetsMustHave(resume.getMeetsMustHave())
                .missingMustHaveSkills(missingMustHave)
                .matchedOptionalSkills(matchedOptional)
                .screeningSessionId(resume.getScreeningSession() != null ? resume.getScreeningSession().getId() : null)
                .build();
    }
}
