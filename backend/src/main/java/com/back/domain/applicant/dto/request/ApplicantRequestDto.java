package com.back.domain.applicant.dto.request;

import jakarta.validation.constraints.NotNull;

public record ApplicantRequestDto(
        @NotNull
        String name,
        @NotNull
        String phone,
        @NotNull
        String email,
        @NotNull
        String address
) {
}
