package com.back.domain.adoption.dto.request;


import jakarta.validation.constraints.NotNull;

public record AdoptionRequestDto(
        @NotNull
        Long petId,

        @NotNull
        String title,

        String anotherPets,

        String experience,

        String message
) {

}
