package com.resumescreener.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DocumentParserService {

    private final PDFParserService pdfParserService;
    private final DocxParserService docxParserService;

    public String extractText(MultipartFile file) throws IOException {
        return extractText(file.getOriginalFilename(), file.getBytes());
    }

    public String extractText(String fileName, byte[] content) throws IOException {
        String lower = fileName != null ? fileName.toLowerCase(Locale.ROOT) : "";
        if (lower.endsWith(".pdf")) {
            return pdfParserService.extractText(content, fileName);
        }
        if (lower.endsWith(".docx")) {
            return docxParserService.extractText(content, fileName);
        }
        throw new IllegalArgumentException("Unsupported file type. Upload PDF or DOCX only: " + fileName);
    }
}
