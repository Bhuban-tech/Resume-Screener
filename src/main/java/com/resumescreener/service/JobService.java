package com.resumescreener.service;

import com.resumescreener.dto.JobDto;
import com.resumescreener.dto.UploadRequestDto;
import com.resumescreener.entity.JobDescription;
import com.resumescreener.exception.ResourceNotFoundException;
import com.resumescreener.repository.JobDescriptionRepository;
import com.resumescreener.repository.ScreeningSessionRepository;
import com.resumescreener.util.SkillListUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final ScreeningSessionRepository screeningSessionRepository;

    @Transactional(readOnly = true)
    public List<JobDto> listJobs() {
        return jobDescriptionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobDto getJob(Long id) {
        return toDto(findJob(id));
    }

    public JobDescription resolveJob(UploadRequestDto request) {
        if (request.getExistingJobId() != null) {
            JobDescription existing = findJob(request.getExistingJobId());
            if (request.getJobTitle() != null && !request.getJobTitle().isBlank()) {
                existing.setTitle(request.getJobTitle());
            }
            if (request.getJobDescription() != null && !request.getJobDescription().isBlank()) {
                existing.setDescription(request.getJobDescription());
            }
            applySkills(existing, request);
            if (request.getMinExperience() != null) {
                existing.setMinExperience(request.getMinExperience());
            }
            return jobDescriptionRepository.save(existing);
        }

        String mustHave = resolveMustHaveSkills(request);
        JobDescription job = JobDescription.builder()
                .title(request.getJobTitle())
                .description(request.getJobDescription())
                .requiredSkills(mustHave)
                .mustHaveSkills(mustHave)
                .optionalSkills(request.getOptionalSkills() != null ? request.getOptionalSkills().trim() : "")
                .minExperience(request.getMinExperience())
                .build();
        return jobDescriptionRepository.save(job);
    }

    public JobDto saveJob(UploadRequestDto request) {
        request.setSaveJob(true);
        return toDto(resolveJob(request));
    }

    public static String resolveMustHaveSkills(UploadRequestDto request) {
        if (request.getMustHaveSkills() != null && !request.getMustHaveSkills().isBlank()) {
            return request.getMustHaveSkills().trim();
        }
        if (request.getRequiredSkills() != null && !request.getRequiredSkills().isBlank()) {
            return request.getRequiredSkills().trim();
        }
        return "";
    }

    private void applySkills(JobDescription job, UploadRequestDto request) {
        String mustHave = resolveMustHaveSkills(request);
        if (!mustHave.isBlank()) {
            job.setMustHaveSkills(mustHave);
            job.setRequiredSkills(mustHave);
        }
        if (request.getOptionalSkills() != null) {
            job.setOptionalSkills(request.getOptionalSkills().trim());
        }
    }

    private JobDescription findJob(Long id) {
        return jobDescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    private JobDto toDto(JobDescription job) {
        long count = screeningSessionRepository.findAll().stream()
                .filter(s -> s.getJobDescription() != null && s.getJobDescription().getId().equals(job.getId()))
                .count();
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .mustHaveSkills(job.getMustHaveSkills() != null ? job.getMustHaveSkills() : job.getRequiredSkills())
                .optionalSkills(job.getOptionalSkills())
                .minExperience(job.getMinExperience())
                .createdAt(job.getCreatedAt())
                .screeningCount((int) count)
                .build();
    }
}
