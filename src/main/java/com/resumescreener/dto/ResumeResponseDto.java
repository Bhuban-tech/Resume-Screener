package com.resumescreener.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeResponseDto {
    private Long resumeId;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private ScoreDto scores;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> recommendations;
    private String fileName;
    private Integer experienceYears;
    private String education;
    private String status;
    private Boolean meetsMustHave;
    private List<String> missingMustHaveSkills;
    private List<String> matchedOptionalSkills;
    private Long screeningSessionId;
}
