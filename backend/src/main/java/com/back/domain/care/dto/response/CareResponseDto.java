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
        String memberName,
        String memberPhone,
        String memberEmail,
        String memberAddress,
        String title,
        String message,
        String anotherPets,
        String experience,
        LocalDateTime desiredStartDate,
        LocalDateTime desiredEndDate,
        LocalDateTime createdAt

) {

    public static CareResponseDto from(Care care) {
        return CareResponseDto.builder()
                .careId(care.getId())
                .petId(care.getPet().getId())
                .memberId(care.getMember().getId())
                .memberName(care.getMember().getName())
                .memberPhone(care.getMember().getPhone())
                .memberEmail(care.getMember().getEmail())
                .memberAddress(care.getMember().getAddress())
                .title(care.getTitle())
                .anotherPets(care.getAnotherPets())
                .experience(care.getExperience())
                .message(care.getMessage())
                .desiredStartDate(care.getDesiredStartDate())
                .desiredEndDate(care.getDesiredEndDate())
                .createdAt(care.getCreatedAt())
                .build();
    }
}
