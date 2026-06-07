package com.resumescreener.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class SkillScoreBreakdown {
    private final double skillScore;
    private final boolean meetsMustHave;
    private final List<String> missingMustHaveSkills;
    private final List<String> matchedOptionalSkills;
}
