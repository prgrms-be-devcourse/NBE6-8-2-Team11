package com.back.domain.adoption.dto.response;

import com.back.domain.adoption.entity.Adoption;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record AdoptionResponseDto(
        Long adoptionId,
        Long petId,
        Long memberId,
        String message,
        LocalDateTime createdAt

) {

    public static AdoptionResponseDto from(Adoption adoption) {
        return AdoptionResponseDto.builder()
                .adoptionId(adoption.getId())
                .petId(adoption.getPet().getId())
                .memberId(adoption.getMember().getId())
                .message(adoption.getMessage())
                .createdAt(adoption.getCreatedAt())
                .build();
    }
}
