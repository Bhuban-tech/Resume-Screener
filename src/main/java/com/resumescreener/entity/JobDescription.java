package com.resumescreener.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "job_descriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills; // legacy alias for must-have

    @Column(name = "must_have_skills", columnDefinition = "TEXT")
    private String mustHaveSkills;

    @Column(name = "optional_skills", columnDefinition = "TEXT")
    private String optionalSkills;

    @Column(name = "min_experience")
    private Integer minExperience;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "jobDescription", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resume> resumes;
}
