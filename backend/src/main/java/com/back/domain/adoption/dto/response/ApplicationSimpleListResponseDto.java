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
    LocalDateTime createdAt,
    PetInfoResponseDto petInfo, // Pet 정보 추가
    LocalDateTime desiredStartDate, // Care인 경우에만 사용
    LocalDateTime desiredEndDate    // Care인 경우에만 사용
) {
    
    public static ApplicationSimpleListResponseDto fromAdoption(Adoption adoption) {
        return ApplicationSimpleListResponseDto.builder()
                .id(adoption.getId())
                .title(adoption.getTitle())
                .type("ADOPTION")
                .status(adoption.getStatus())
                .createdAt(adoption.getCreatedAt())
                .petInfo(PetInfoResponseDto.from(adoption.getPet()))
                .build();
    }
    
    public static ApplicationSimpleListResponseDto fromCare(Care care) {
        return ApplicationSimpleListResponseDto.builder()
                .id(care.getId())
                .title(care.getTitle())
                .type("CARE")
                .status(care.getStatus())
                .createdAt(care.getCreatedAt())
                .petInfo(PetInfoResponseDto.from(care.getPet()))
                .desiredStartDate(care.getDesiredStartDate())
                .desiredEndDate(care.getDesiredEndDate())
                .build();
    }
} 