package com.back.domain.adoption.dto.request;


public record AdoptionRequestDto(
        Long petId,
        String title,
        String message
) {

}
