package com.back.domain.adoption.dto.request;


import com.back.domain.applicant.dto.request.ApplicantRequestDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdoptionRequestDto(
        @NotNull
        Long petId,

        @NotNull
        String title,

        ApplicantRequestDto applicantInfo,

        String anotherPets,

        String experience,
        
        String message
) {

}
