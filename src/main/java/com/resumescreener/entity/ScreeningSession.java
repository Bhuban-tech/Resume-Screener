package com.resumescreener.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "screening_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreeningSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_description_id", nullable = false)
    private JobDescription jobDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ScreeningStatus status = ScreeningStatus.PENDING;

    @Column(name = "total_files", nullable = false)
    private int totalFiles;

    @Column(name = "processed_files", nullable = false)
    @Builder.Default
    private int processedFiles = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "screeningSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Resume> resumes = new ArrayList<>();
}
