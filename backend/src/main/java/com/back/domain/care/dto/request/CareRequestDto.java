package com.back.domain.care.dto.request;


import java.time.LocalDateTime;

public record CareRequestDto(
        Long petId,
        Long memberId,
        String message,
        LocalDateTime desiredStartDate,
        LocalDateTime desiredEndDate
) {

}
