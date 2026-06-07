package com.resumescreener.controller;

import com.resumescreener.dto.JobDto;
import com.resumescreener.dto.UploadRequestDto;
import com.resumescreener.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobDto>> listJobs() {
        return ResponseEntity.ok(jobService.listJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }

    @PostMapping
    public ResponseEntity<JobDto> saveJob(@Valid @RequestBody UploadRequestDto request) {
        JobDto job = jobService.saveJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(job);
    }
}
