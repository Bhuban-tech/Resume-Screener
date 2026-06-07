package com.resumescreener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadRequestDto {

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private String requiredSkills; // legacy

    private String mustHaveSkills;

    private String optionalSkills;

    @NotNull(message = "Minimum experience is required")
    private Integer minExperience;

    private Long existingJobId;

    @Builder.Default
    private boolean saveJob = true;
}
