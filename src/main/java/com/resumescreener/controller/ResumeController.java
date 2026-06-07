package com.resumescreener.controller;

import com.resumescreener.dto.ResumeResponseDto;
import com.resumescreener.dto.ScreeningSessionDto;
import com.resumescreener.dto.UpdateCandidateStatusDto;
import com.resumescreener.dto.UploadRequestDto;
import com.resumescreener.service.ResumeService;
import com.resumescreener.service.ScreeningService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Slf4j
@Validated
public class ResumeController {

    private final ResumeService resumeService;
    private final ScreeningService screeningService;

    /**
     * Legacy upload endpoint. Prefer {@code POST /api/screenings/upload}.
     */
    @Deprecated
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ScreeningSessionDto> uploadResumes(
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam(value = "mustHaveSkills", required = false) String mustHaveSkills,
            @RequestParam(value = "optionalSkills", required = false) String optionalSkills,
            @RequestParam(value = "requiredSkills", required = false) String requiredSkills,
            @RequestParam("minExperience") Integer minExperience,
            @RequestParam(value = "existingJobId", required = false) Long existingJobId,
            @RequestParam("files") @NotNull List<MultipartFile> files) throws IOException {

        UploadRequestDto request = UploadRequestDto.builder()
                .jobTitle(jobTitle)
                .jobDescription(jobDescription)
                .mustHaveSkills(mustHaveSkills)
                .optionalSkills(optionalSkills)
                .requiredSkills(requiredSkills)
                .minExperience(minExperience)
                .existingJobId(existingJobId)
                .build();

        ScreeningSessionDto session = screeningService.startAsyncScreening(request, files);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(session);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponseDto> getResume(@PathVariable Long id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResumeResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCandidateStatusDto body) {
        return ResponseEntity.ok(resumeService.updateStatus(id, body.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully", "id", id.toString()));
    }
}
