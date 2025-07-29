package com.back.domain.adoption.dto.request;

import jakarta.validation.constraints.NotNull;

public record AdoptionCareStatusUpdateRequestDto(
        @NotNull
        Long id,

        @NotNull
        String type, // "ADOPTION" 또는 "CARE"

        @NotNull
        String status // "ACCEPTED", "REJECTED"
) {
}
