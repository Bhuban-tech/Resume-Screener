package com.resumescreener.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String mustHaveSkills;
    private String optionalSkills;
    private Integer minExperience;
    private LocalDateTime createdAt;
    private int screeningCount;
}
