package com.resumescreener.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_data", columnDefinition = "TEXT")
    private String fileData; // extracted text from PDF

    @Column(name = "candidate_name")
    private String candidateName;

    @Column(name = "candidate_email")
    private String candidateEmail;

    @Column(name = "candidate_phone")
    private String candidatePhone;

    @Column(columnDefinition = "TEXT")
    private String skills; // comma-separated matched skills

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column
    private Double score;

    @Column(name = "skill_score")
    private Double skillScore;

    @Column(name = "experience_score")
    private Double experienceScore;

    @Column(name = "education_score")
    private Double educationScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_description_id")
    private JobDescription jobDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_session_id")
    private ScreeningSession screeningSession;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private CandidateStatus status = CandidateStatus.PENDING;

    @Column(name = "meets_must_have")
    @Builder.Default
    private Boolean meetsMustHave = true;

    @Column(name = "matched_optional_skills", columnDefinition = "TEXT")
    private String matchedOptionalSkills;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
