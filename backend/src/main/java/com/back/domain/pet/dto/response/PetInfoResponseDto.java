package com.back.domain.pet.dto.response;

import com.back.domain.pet.entity.Pet;
import lombok.Builder;

@Builder
public record PetInfoResponseDto(
        Long id,
        String name,
        String species,
        int age,
        String gender,
        String description,
        String imageUrl,
        String shelterName
) {
    public static PetInfoResponseDto from(Pet pet) {
        return PetInfoResponseDto.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .age(pet.getAge())
                .gender(pet.getGender().name())
                .description(pet.getDescription())
                .imageUrl(pet.getImageUrl())
                .shelterName(getShelterName(pet))
                .build();
    }

    private static String getShelterName(Pet pet) {
        return pet.getShelter() != null ? pet.getShelter().getName() : "보호소 정보 없음";
    }
}
