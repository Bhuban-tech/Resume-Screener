package com.resumescreener.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
public class PDFParserService {

    /**
     * Extract raw text from a PDF MultipartFile
     */
    public String extractText(MultipartFile file) throws IOException {
        return extractText(file.getBytes(), file.getOriginalFilename());
    }

    public String extractText(byte[] content, String fileName) throws IOException {
        try (PDDocument document = Loader.loadPDF(content)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.debug("Extracted {} characters from {}", text.length(), fileName);
            return text;
        } catch (IOException e) {
            log.error("Failed to parse PDF: {}", fileName, e);
            throw new RuntimeException("Failed to parse PDF file: " + fileName, e);
        }
    }
}
