package com.back.domain.adoption.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdoptionRequestDto(
        @NotNull
        Long petId,

        @NotNull
        String title,

        @NotBlank(message = "메세지는 비어있을 수 없습니다.")
        String message
) {

}
