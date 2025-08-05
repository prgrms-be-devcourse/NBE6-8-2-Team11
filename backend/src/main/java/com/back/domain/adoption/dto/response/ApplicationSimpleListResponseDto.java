package com.back.domain.adoption.dto.response;

import com.back.domain.adoption.entity.Adoption;
import com.back.domain.adoption.enums.RequestStatus;
import com.back.domain.care.entity.Care;
import com.back.domain.pet.dto.response.PetInfoResponseDto;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record ApplicationSimpleListResponseDto(
    Long id,
    String title,
    String type, // "ADOPTION" 또는 "CARE"
    RequestStatus status,
    LocalDateTime createdAt
) {
    
    public static ApplicationSimpleListResponseDto fromAdoption(Adoption adoption) {
        return ApplicationSimpleListResponseDto.builder()
                .id(adoption.getId())
                .type("ADOPTION")
                .status(adoption.getStatus())
                .createdAt(adoption.getCreatedAt())
                .build();
    }
    
    public static ApplicationSimpleListResponseDto fromCare(Care care) {
        return ApplicationSimpleListResponseDto.builder()
                .id(care.getId())
                .type("CARE")
                .status(care.getStatus())
                .createdAt(care.getCreatedAt())
                .build();
    }
} 