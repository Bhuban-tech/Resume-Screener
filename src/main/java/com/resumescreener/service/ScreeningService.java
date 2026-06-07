package com.resumescreener.service;

import com.resumescreener.dto.FilePayload;
import com.resumescreener.dto.ResumeResponseDto;
import com.resumescreener.dto.ScreeningSessionDto;
import com.resumescreener.dto.UploadRequestDto;
import com.resumescreener.entity.JobDescription;
import com.resumescreener.entity.ScreeningSession;
import com.resumescreener.entity.ScreeningStatus;
import com.resumescreener.exception.ResourceNotFoundException;
import com.resumescreener.repository.ScreeningSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScreeningService {

    private final ScreeningSessionRepository screeningSessionRepository;
    private final JobService jobService;
    private final ResumeService resumeService;
    private final AsyncScreeningProcessor asyncScreeningProcessor;

    @Transactional
    public ScreeningSessionDto startAsyncScreening(UploadRequestDto request, List<MultipartFile> files)
            throws IOException {
        List<FilePayload> payloads = new ArrayList<>();
        for (MultipartFile file : files) {
            payloads.add(FilePayload.of(file.getOriginalFilename(), file.getBytes()));
        }
        return startAsyncScreeningWithPayloads(request, payloads);
    }

    @Transactional
    public ScreeningSessionDto startAsyncScreeningWithPayloads(UploadRequestDto request, List<FilePayload> payloads) {
        JobDescription job = jobService.resolveJob(request);

        ScreeningSession session = ScreeningSession.builder()
                .jobDescription(job)
                .status(ScreeningStatus.PENDING)
                .totalFiles(payloads.size())
                .processedFiles(0)
                .build();
        session = screeningSessionRepository.save(session);

        asyncScreeningProcessor.processScreening(session.getId(), request, payloads);

        return toSummaryDto(session, null);
    }

    @Transactional(readOnly = true)
    public ScreeningSessionDto getScreening(Long id) {
        ScreeningSession session = screeningSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screening session not found: " + id));

        List<ResumeResponseDto> results = null;
        if (session.getStatus() == ScreeningStatus.COMPLETED) {
            results = resumeService.getResultsForSession(id);
        }
        return toSummaryDto(session, results);
    }

    @Transactional(readOnly = true)
    public List<ScreeningSessionDto> listScreenings() {
        return screeningSessionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(s -> toSummaryDto(s, null))
                .collect(Collectors.toList());
    }

    private ScreeningSessionDto toSummaryDto(ScreeningSession session, List<ResumeResponseDto> results) {
        int progress = session.getTotalFiles() == 0
                ? 0
                : (int) ((session.getProcessedFiles() * 100.0) / session.getTotalFiles());

        return ScreeningSessionDto.builder()
                .id(session.getId())
                .status(session.getStatus().name())
                .totalFiles(session.getTotalFiles())
                .processedFiles(session.getProcessedFiles())
                .progressPercent(progress)
                .errorMessage(session.getErrorMessage())
                .jobId(session.getJobDescription() != null ? session.getJobDescription().getId() : null)
                .jobTitle(session.getJobDescription() != null ? session.getJobDescription().getTitle() : null)
                .createdAt(session.getCreatedAt())
                .completedAt(session.getCompletedAt())
                .results(results)
                .build();
    }
}
