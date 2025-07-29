package com.back.domain.shelter.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record ShelterRequestDto(
        @NotBlank(message = "보호소 이름은 필수입니다.")
        String name,
        @NotBlank(message = "보호소 주소는 필수입니다")
        String address,
        String city,
        String state,
        String zipCode,
        String phone
) {
}
