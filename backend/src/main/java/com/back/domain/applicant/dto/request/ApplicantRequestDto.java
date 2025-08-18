package com.back.domain.applicant.dto.request;

import com.back.domain.applicant.entity.Applicant;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record ApplicantRequestDto(
        @NotNull
        String name,
        @NotNull
        String phone,
        @NotNull
        String email,
        @NotNull
        String address
) {
    public static Applicant of (ApplicantRequestDto applicantRequestDto) {
        return Applicant.builder()
                .name(applicantRequestDto.name())
                .phone(applicantRequestDto.phone())
                .email(applicantRequestDto.email())
                .address(applicantRequestDto.address())
                .build();
    }
}
