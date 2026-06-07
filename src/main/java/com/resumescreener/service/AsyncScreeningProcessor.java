package com.resumescreener.service;

import com.resumescreener.dto.FilePayload;
import com.resumescreener.dto.UploadRequestDto;
import com.resumescreener.entity.JobDescription;
import com.resumescreener.entity.ScreeningSession;
import com.resumescreener.exception.ResourceNotFoundException;
import com.resumescreener.repository.ScreeningSessionRepository;
import com.resumescreener.util.SkillListUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AsyncScreeningProcessor {

    private final ScreeningSessionRepository screeningSessionRepository;
    private final ResumeService resumeService;
    private final ScreeningProgressService progressService;

    @Async("screeningExecutor")
    public void processScreening(Long sessionId, UploadRequestDto request, List<FilePayload> payloads) {
        ScreeningSession session = screeningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Screening session not found: " + sessionId));

        try {
            progressService.markProcessing(sessionId);

            JobDescription job = session.getJobDescription();
            List<String> mustHave = SkillListUtil.parseCommaSeparated(
                    job.getMustHaveSkills() != null ? job.getMustHaveSkills() : job.getRequiredSkills());
            List<String> optional = SkillListUtil.parseCommaSeparated(job.getOptionalSkills());

            int processed = 0;
            for (FilePayload payload : payloads) {
                resumeService.processResumeFile(
                        payload.getFileName(),
                        payload.getContent(),
                        job,
                        session,
                        mustHave,
                        optional
                );
                processed++;
                progressService.updateProgress(sessionId, processed);
            }

            progressService.markCompleted(sessionId);
            log.info("Screening session {} completed — {} files", sessionId, processed);
        } catch (Exception e) {
            log.error("Screening session {} failed", sessionId, e);
            progressService.markFailed(sessionId, e.getMessage());
        }
    }
}
