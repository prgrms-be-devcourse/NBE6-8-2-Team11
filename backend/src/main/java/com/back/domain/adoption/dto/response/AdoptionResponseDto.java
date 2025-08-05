package com.back.domain.adoption.dto.response;

import com.back.domain.adoption.entity.Adoption;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record AdoptionResponseDto(
        Long adoptionId,
        Long petId,
        Long memberId,
        String memberName,
        String memberPhone,
        String memberEmail,
        String memberAddress,
        String anotherPets,
        String experience,
        String title,
        String message,
        LocalDateTime createdAt

) {

    public static AdoptionResponseDto from(Adoption adoption) {
        return AdoptionResponseDto.builder()
                .adoptionId(adoption.getId())
                .petId(adoption.getPet().getId())
                .memberId(adoption.getMember().getId())
                .memberName(adoption.getMember().getName())
                .memberPhone(adoption.getMember().getPhone())
                .memberEmail(adoption.getMember().getEmail())
                .memberAddress(adoption.getMember().getAddress())
                .title(adoption.getTitle())
                .anotherPets(adoption.getAnotherPets())
                .experience(adoption.getExperience())
                .message(adoption.getMessage())
                .createdAt(adoption.getCreatedAt())
                .build();
    }
}
