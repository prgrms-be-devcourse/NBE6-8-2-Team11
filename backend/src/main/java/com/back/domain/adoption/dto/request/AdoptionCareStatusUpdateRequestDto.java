package com.back.domain.adoption.dto.request;

public record AdoptionCareStatusUpdateRequestDto(
        Long id,
        String type, // "ADOPTION" 또는 "CARE"
        String status // "ACCEPTED", "REJECTED"
) {
}
