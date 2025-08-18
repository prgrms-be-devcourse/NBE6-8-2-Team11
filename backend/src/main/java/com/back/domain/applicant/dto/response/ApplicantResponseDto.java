package com.back.domain.applicant.dto.response;

import com.back.domain.applicant.entity.Applicant;
import lombok.Builder;

@Builder
public record ApplicantResponseDto (
    Long id,
    String name,
    String phone,
    String email,
    String address
) {
    public static ApplicantResponseDto from(Applicant applicant) {
        return ApplicantResponseDto.builder()
                .id(applicant.getId())
                .name(applicant.getName())
                .phone(applicant.getPhone())
                .email(applicant.getEmail())
                .address(applicant.getAddress())
                .build();
    }
}
