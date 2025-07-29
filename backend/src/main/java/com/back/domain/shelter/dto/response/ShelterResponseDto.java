package com.back.domain.shelter.dto.response;


import com.back.domain.shelter.entity.Shelter;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ShelterResponseDto(
        Long id,
        String name,
        String address,
        String city,
        String state,
        String zipCode,
        String phone,
        LocalDateTime createdAt
) {
    public static ShelterResponseDto from(Shelter shelter) {
        return ShelterResponseDto.builder()
                .id(shelter.getId())
                .name(shelter.getName())
                .address(shelter.getAddress())
                .city(shelter.getCity())
                .state(shelter.getState())
                .zipCode(shelter.getZipCode())
                .phone(shelter.getPhone())
                .createdAt(shelter.getCreatedAt())
                .build();
    }
}