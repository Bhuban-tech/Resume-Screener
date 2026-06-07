package com.resumescreener.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SkillExtractorService {

    // Master skill list — add more as needed
    private static final Set<String> MASTER_SKILLS = new LinkedHashSet<>(Arrays.asList(
            // Languages
            "Java", "Python", "JavaScript", "TypeScript", "Kotlin", "Swift", "Go", "Rust", "C", "C++", "C#",
            "Ruby", "PHP", "Scala", "R",
            // Frameworks
            "Spring Boot", "Spring", "Hibernate", "React", "Angular", "Vue", "Flutter", "Django",
            "FastAPI", "Node.js", "Express", "Next.js", "NestJS",
            // Databases
            "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "Oracle", "SQLite",
            "Elasticsearch", "DynamoDB",
            // Cloud & DevOps
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform",
            "Ansible", "CI/CD", "Linux",
            // Tools
            "Git", "Maven", "Gradle", "Kafka", "RabbitMQ", "GraphQL", "REST", "Microservices",
            "JUnit", "Mockito", "Selenium",
            // Concepts
            "Machine Learning", "Deep Learning", "Data Science", "AI", "NLP",
            "Agile", "Scrum", "TDD", "OOP", "Design Patterns"
    ));

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("(?:\\+?\\d{1,3}[\\s\\-]?)?(?:\\(?\\d{2,4}\\)?[\\s\\-]?){2,4}\\d{3,4}");

    private static final Pattern EXPERIENCE_PATTERN =
            Pattern.compile("(\\d+)\\+?\\s*(?:years?|yrs?)[\\s\\w]*(?:experience|exp)", Pattern.CASE_INSENSITIVE);

    // ──────────────────────────────────────────────────────────────────────────

    public String extractEmail(String text) {
        Matcher m = EMAIL_PATTERN.matcher(text);
        return m.find() ? m.group() : null;
    }

    public String extractPhone(String text) {
        Matcher m = PHONE_PATTERN.matcher(text);
        return m.find() ? m.group().trim() : null;
    }

    public String extractName(String text) {
        // Assume the candidate name is on the first non-empty line
        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty() && trimmed.length() < 60 && !trimmed.contains("@")) {
                // Looks like a name line
                return trimmed;
            }
        }
        return "Unknown";
    }

    public int extractExperienceYears(String text) {
        Matcher m = EXPERIENCE_PATTERN.matcher(text);
        int maxYears = 0;
        while (m.find()) {
            int years = Integer.parseInt(m.group(1));
            maxYears = Math.max(maxYears, years);
        }
        return maxYears;
    }

    /**
     * Return skills from MASTER_SKILLS that appear in the resume text.
     */
    public List<String> extractSkills(String text) {
        return extractSkills(text, null, null);
    }

    /**
     * Overloaded to dynamically include custom recruiter skills during matching.
     */
    public List<String> extractSkills(String text, List<String> mustHave, List<String> optional) {
        String lowerText = text.toLowerCase();
        Set<String> searchSet = new LinkedHashSet<>(MASTER_SKILLS);
        if (mustHave != null) {
            for (String s : mustHave) {
                if (s != null && !s.isBlank()) {
                    searchSet.add(s.trim());
                }
            }
        }
        if (optional != null) {
            for (String s : optional) {
                if (s != null && !s.isBlank()) {
                    searchSet.add(s.trim());
                }
            }
        }
        return searchSet.stream()
                .filter(skill -> lowerText.contains(skill.toLowerCase()))
                .collect(Collectors.toList());
    }


    /**
     * Return skills from the required list that are missing in matched skills.
     */
    public List<String> findMissingSkills(List<String> requiredSkills, List<String> matchedSkills) {
        Set<String> matchedLower = matchedSkills.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        return requiredSkills.stream()
                .filter(s -> !matchedLower.contains(s.toLowerCase()))
                .collect(Collectors.toList());
    }

    public String extractEducation(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("ph.d") || lower.contains("phd") || lower.contains("doctorate")) return "PhD";
        if (lower.contains("master") || lower.contains("m.sc") || lower.contains("m.tech") || lower.contains("mba")) return "Masters";
        if (lower.contains("b.tech") || lower.contains("b.e") || lower.contains("b.sc") ||
                lower.contains("bachelor of technology") || lower.contains("bachelor of engineering")) return "Bachelor(Tech)";
        if (lower.contains("bachelor") || lower.contains("b.a") || lower.contains("b.com")) return "Bachelor(Other)";
        if (lower.contains("diploma")) return "Diploma";
        if (lower.contains("higher secondary") || lower.contains("12th") || lower.contains("hsc")) return "HighSchool";
        return "Unknown";
    }

    public Set<String> getMasterSkills() {
        return Collections.unmodifiableSet(MASTER_SKILLS);
    }
}
