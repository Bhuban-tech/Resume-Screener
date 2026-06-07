package com.resumescreener.controller;

import com.resumescreener.dto.ScreeningSessionDto;
import com.resumescreener.dto.UploadRequestDto;
import com.resumescreener.service.ScreeningService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/screenings")
@RequiredArgsConstructor
@Slf4j
public class ScreeningController {

    private final ScreeningService screeningService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ScreeningSessionDto> uploadAsync(
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam(value = "mustHaveSkills", required = false) String mustHaveSkills,
            @RequestParam(value = "optionalSkills", required = false) String optionalSkills,
            @RequestParam(value = "requiredSkills", required = false) String requiredSkills,
            @RequestParam("minExperience") Integer minExperience,
            @RequestParam(value = "existingJobId", required = false) Long existingJobId,
            @RequestParam(value = "saveJob", defaultValue = "true") boolean saveJob,
            @RequestParam("files") @NotNull List<MultipartFile> files) throws IOException {

        UploadRequestDto request = UploadRequestDto.builder()
                .jobTitle(jobTitle)
                .jobDescription(jobDescription)
                .mustHaveSkills(mustHaveSkills)
                .optionalSkills(optionalSkills)
                .requiredSkills(requiredSkills)
                .minExperience(minExperience)
                .existingJobId(existingJobId)
                .saveJob(saveJob)
                .build();

        ScreeningSessionDto session = screeningService.startAsyncScreening(request, files);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(session);
    }

    @GetMapping
    public ResponseEntity<List<ScreeningSessionDto>> listScreenings() {
        return ResponseEntity.ok(screeningService.listScreenings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScreeningSessionDto> getScreening(@PathVariable Long id) {
        return ResponseEntity.ok(screeningService.getScreening(id));
    }
}
