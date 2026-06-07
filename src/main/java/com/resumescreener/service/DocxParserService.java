package com.resumescreener.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DocxParserService {

    public String extractText(byte[] content, String fileName) {
        try (XWPFDocument document = new XWPFDocument(new ByteArrayInputStream(content))) {
            String text = document.getParagraphs().stream()
                    .map(XWPFParagraph::getText)
                    .collect(Collectors.joining("\n"));
            log.debug("Extracted {} characters from {}", text.length(), fileName);
            return text;
        } catch (IOException e) {
            log.error("Failed to parse DOCX: {}", fileName, e);
            throw new RuntimeException("Failed to parse DOCX file: " + fileName, e);
        }
    }

    public String extractText(MultipartFile file) throws IOException {
        return extractText(file.getBytes(), file.getOriginalFilename());
    }
}
