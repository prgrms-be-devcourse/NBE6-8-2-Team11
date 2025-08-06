package com.back.domain.pet.dto.response;

import com.back.domain.pet.entity.Pet;
import java.time.LocalDateTime;
import lombok.Builder;

import java.util.List;
import java.util.stream.Collectors;

@Builder
public record PetInfoResponseDto(
        Long id,
        Long petOwnerId,
        String name,
        String species,
        int age,
        String gender,
        String description,
        String imageUrl,
        String shelterName,
        LocalDateTime createdAt,
        List<String> petStatuses
) {
    public static PetInfoResponseDto from(Pet pet) {
        return PetInfoResponseDto.builder()
                .id(pet.getId())
                .petOwnerId(pet.getMember().getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .age(pet.getAge())
                .gender(pet.getGender().name())
                .description(pet.getDescription())
                .imageUrl(pet.getImageUrl())
                .shelterName(getShelterName(pet))
                .createdAt(pet.getCreatedAt())
                .petStatuses(
                        pet.getPetStatuses().stream()
                                .map(ps -> ps.getStatus().name())
                                .collect(Collectors.toList())
                )
                .build();
    }

    private static String getShelterName(Pet pet) {
        return pet.getShelter() != null ? pet.getShelter().getName() : "보호소 정보 없음";
    }
}
