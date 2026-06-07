package com.resumescreener.service;

import com.resumescreener.entity.ScreeningSession;
import com.resumescreener.entity.ScreeningStatus;
import com.resumescreener.exception.ResourceNotFoundException;
import com.resumescreener.repository.ScreeningSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ScreeningProgressService {

    private final ScreeningSessionRepository screeningSessionRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markProcessing(Long sessionId) {
        ScreeningSession session = find(sessionId);
        session.setStatus(ScreeningStatus.PROCESSING);
        screeningSessionRepository.save(session);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateProgress(Long sessionId, int processedFiles) {
        ScreeningSession session = find(sessionId);
        session.setProcessedFiles(processedFiles);
        screeningSessionRepository.save(session);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markCompleted(Long sessionId) {
        ScreeningSession session = find(sessionId);
        session.setStatus(ScreeningStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        screeningSessionRepository.save(session);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markFailed(Long sessionId, String errorMessage) {
        ScreeningSession session = find(sessionId);
        session.setStatus(ScreeningStatus.FAILED);
        session.setErrorMessage(errorMessage);
        session.setCompletedAt(LocalDateTime.now());
        screeningSessionRepository.save(session);
    }

    private ScreeningSession find(Long sessionId) {
        return screeningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Screening session not found: " + sessionId));
    }
}
