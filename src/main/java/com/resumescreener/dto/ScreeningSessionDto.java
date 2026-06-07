package com.resumescreener.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreeningSessionDto {
    private Long id;
    private String status;
    private int totalFiles;
    private int processedFiles;
    private int progressPercent;
    private String errorMessage;
    private Long jobId;
    private String jobTitle;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private List<ResumeResponseDto> results;
}
