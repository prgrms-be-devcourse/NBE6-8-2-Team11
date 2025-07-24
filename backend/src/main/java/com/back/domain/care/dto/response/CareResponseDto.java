package com.back.domain.care.dto.response;

import com.back.domain.adoption.entity.Adoption;
import com.back.domain.care.entity.Care;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record CareResponseDto(
        Long careId,
        Long petId,
        Long memberId,
        String message,
        LocalDateTime desiredStartDate,
        LocalDateTime desiredEndDate,
        LocalDateTime createdAt

) {

    public static CareResponseDto from(Care care) {
        return CareResponseDto.builder()
                .careId(care.getId())
                .petId(care.getPet().getId())
                .memberId(care.getMember().getId())
                .message(care.getMessage())
                .desiredStartDate(care.getDesiredStartDate())
                .desiredEndDate(care.getDesiredEndDate())
                .createdAt(care.getCreatedAt())
                .build();
    }
}
