package com.resumescreener.service;

import com.resumescreener.dto.SkillScoreBreakdown;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ScoringService {

    // Weights
    private static final double SKILL_WEIGHT      = 0.60;
    private static final double EXPERIENCE_WEIGHT = 0.30;
    private static final double EDUCATION_WEIGHT  = 0.10;

    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Skill score: (matchedSkills / requiredSkills) × 100, weighted by SKILL_WEIGHT.
     */
    public double calculateSkillScore(int matchedCount, int requiredCount) {
        if (requiredCount == 0) return 100.0;
        return Math.min(100.0, ((double) matchedCount / requiredCount) * 100.0);
    }

    /**
     * Must-have skills drive the base score; optional skills add a capped bonus.
     * Missing any must-have caps the skill score at 49.
     */
    public SkillScoreBreakdown calculateSkillScoreWithMustHave(
            List<String> mustHaveSkills,
            List<String> optionalSkills,
            List<String> matchedSkills) {

        Set<String> matchedLower = matchedSkills.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<String> missingMustHave = mustHaveSkills.stream()
                .filter(s -> !matchedLower.contains(s.toLowerCase()))
                .collect(Collectors.toList());

        List<String> matchedOptional = optionalSkills.stream()
                .filter(s -> matchedLower.contains(s.toLowerCase()))
                .collect(Collectors.toList());

        boolean meetsMustHave = missingMustHave.isEmpty();

        int mustMatched = mustHaveSkills.size() - missingMustHave.size();
        double mustScore = mustHaveSkills.isEmpty()
                ? 100.0
                : ((double) mustMatched / mustHaveSkills.size()) * 100.0;

        double optionalBonus = Math.min(15.0, matchedOptional.size() * 3.0);
        double skillScore = Math.min(100.0, mustScore + optionalBonus);

        if (!meetsMustHave && !mustHaveSkills.isEmpty()) {
            skillScore = Math.min(skillScore, 49.0);
        }

        return SkillScoreBreakdown.builder()
                .skillScore(Math.round(skillScore * 100.0) / 100.0)
                .meetsMustHave(meetsMustHave)
                .missingMustHaveSkills(missingMustHave)
                .matchedOptionalSkills(matchedOptional)
                .build();
    }

    /**
     * Experience score based on gap from required years, weighted by EXPERIENCE_WEIGHT.
     */
    public double calculateExperienceScore(int candidateYears, int requiredYears) {
        int gap = candidateYears - requiredYears;
        if (gap >= 0)      return 100.0;
        if (gap == -1)     return 66.0;
        if (gap == -2)     return 33.0;
        return 0.0;
    }

    /**
     * Education score based on highest qualification detected.
     */
    public double calculateEducationScore(String education) {
        if (education == null) return 0.0;
        return switch (education) {
            case "PhD"            -> 100.0;
            case "Masters"        -> 90.0;
            case "Bachelor(Tech)" -> 80.0;
            case "Bachelor(Other)"-> 70.0;
            case "Diploma"        -> 50.0;
            case "HighSchool"     -> 30.0;
            default               -> 0.0;
        };
    }

    /**
     * Weighted total score out of 100.
     */
    public double calculateTotalScore(double skillScore, double experienceScore, double educationScore) {
        double total = (skillScore * SKILL_WEIGHT)
                + (experienceScore * EXPERIENCE_WEIGHT)
                + (educationScore * EDUCATION_WEIGHT);
        return Math.round(total * 100.0) / 100.0;
    }

    /**
     * Generate human-readable recommendations based on missing skills and gaps.
     */
    public List<String> generateRecommendations(List<String> missingSkills,
                                                 int candidateYears,
                                                 int requiredYears,
                                                 String education) {
        return generateRecommendations(missingSkills, List.of(), candidateYears, requiredYears, education);
    }

    public List<String> generateRecommendations(List<String> missingMustHave,
                                                 List<String> matchedOptional,
                                                 int candidateYears,
                                                 int requiredYears,
                                                 String education) {
        List<String> recs = new ArrayList<>();

        if (!missingMustHave.isEmpty()) {
            recs.add("Missing required skills: " + String.join(", ", missingMustHave) + ".");
            int limit = Math.min(2, missingMustHave.size());
            for (int i = 0; i < limit; i++) {
                recs.add("Must-have: learn " + missingMustHave.get(i) + ".");
            }
        }

        if (!matchedOptional.isEmpty()) {
            recs.add("Nice-to-have matched: " + String.join(", ", matchedOptional) + ".");
        }

        // Skill recommendations (legacy missing list)
        if (!missingMustHave.isEmpty() && recs.size() < 4) {
            int extraLimit = Math.min(3, missingMustHave.size());
            for (int i = 0; i < extraLimit; i++) {
                final String skill = missingMustHave.get(i);
                if (!recs.stream().anyMatch(r -> r.contains(skill))) {
                    recs.add("Learn " + skill + " to improve skill score.");
                }
            }
        }

        // Experience recommendations
        int gap = requiredYears - candidateYears;
        if (gap > 0) {
            recs.add("Gain " + gap + " more year(s) of experience to meet the requirement.");
        }

        // Education recommendations
        if ("Diploma".equals(education) || "HighSchool".equals(education) || "Unknown".equals(education)) {
            recs.add("Pursuing a Bachelor's or higher degree will significantly improve your score.");
        }

        if (recs.isEmpty()) {
            recs.add("Strong candidate — meets or exceeds all requirements.");
        }

        return recs;
    }
}
