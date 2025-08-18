package com.back.domain.adoption.dto.response;

import com.back.domain.adoption.entity.Adoption;
import com.back.domain.applicant.dto.response.ApplicantResponseDto;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record AdoptionResponseDto(
        Long adoptionId,
        Long petId,
        Long memberId,
        ApplicantResponseDto applicantInfo,
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
                .applicantInfo(ApplicantResponseDto.builder()
                        .id(adoption.getApplicant().getId())
                        .name(adoption.getApplicant().getName())
                        .phone(adoption.getApplicant().getPhone())
                        .email(adoption.getApplicant().getEmail())
                        .address(adoption.getApplicant().getAddress())
                        .build())
                .title(adoption.getTitle())
                .anotherPets(adoption.getAnotherPets())
                .experience(adoption.getExperience())
                .message(adoption.getMessage())
                .createdAt(adoption.getCreatedAt())
                .build();
    }
}
