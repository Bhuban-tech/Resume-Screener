package com.resumescreener.util;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public final class SkillListUtil {

    private SkillListUtil() {}

    public static List<String> parseCommaSeparated(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public static String join(List<String> skills) {
        return String.join(",", skills);
    }
}
