package com.resumescreener.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCandidateStatusDto {
    @NotBlank
    private String status; // PENDING, SHORTLISTED, REJECTED
}
