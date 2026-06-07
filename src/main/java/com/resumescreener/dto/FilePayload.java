package com.resumescreener.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FilePayload {
    private final String fileName;
    private final byte[] content;

    public static FilePayload of(String fileName, byte[] content) {
        return new FilePayload(fileName, content);
    }
}
