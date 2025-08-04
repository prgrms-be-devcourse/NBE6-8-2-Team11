package com.back.domain.adoption.dto.response;

import com.back.domain.pet.dto.response.PetInfoResponseDto;
import com.back.domain.adoption.entity.Adoption;
import com.back.domain.adoption.enums.RequestStatus;
import com.back.domain.care.entity.Care;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record ApplicationResponseDto(
    Long id,
    String title,
    String type, // "ADOPTION" 또는 "CARE"
    String anotherPets,
    String experience,
    String message,
    RequestStatus status,
    LocalDateTime createdAt,
    PetInfoResponseDto petInfo,
    LocalDateTime desiredStartDate, // Care인 경우에만 사용
    LocalDateTime desiredEndDate    // Care인 경우에만 사용
) {
    
    public static ApplicationResponseDto fromAdoption(Adoption adoption) {
        return ApplicationResponseDto.builder()
                .id(adoption.getId())
                .title(adoption.getTitle())
                .type("ADOPTION")
                .anotherPets(adoption.getAnotherPets())
                .experience(adoption.getExperience())
                .message(adoption.getMessage())
                .status(adoption.getStatus())
                .createdAt(adoption.getCreatedAt())
                .petInfo(PetInfoResponseDto.from(adoption.getPet()))
                .build();
    }
    
    public static ApplicationResponseDto fromCare(Care care) {
        return ApplicationResponseDto.builder()
                .id(care.getId())
                .title(care.getTitle())
                .type("CARE")
                .anotherPets(care.getAnotherPets())
                .experience(care.getExperience())
                .message(care.getMessage())
                .status(care.getStatus())
                .createdAt(care.getCreatedAt())
                .petInfo(PetInfoResponseDto.from(care.getPet()))
                .desiredStartDate(care.getDesiredStartDate())
                .desiredEndDate(care.getDesiredEndDate())
                .build();
    }
} 