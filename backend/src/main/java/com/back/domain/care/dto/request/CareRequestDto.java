package com.back.domain.care.dto.request;


import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record CareRequestDto(
        Long petId,
        String title,
        String message,
        LocalDateTime desiredStartDate,
        LocalDateTime desiredEndDate
) {

}
