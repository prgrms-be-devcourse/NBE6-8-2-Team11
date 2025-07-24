package com.back.domain.adoption.dto.request;


public record AdoptionRequestDto(
        Long petId,
        Long memberId,
        String title,
        String message
) {

}
