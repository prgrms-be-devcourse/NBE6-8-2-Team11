package com.back.domain.pet.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;


@Getter
@AllArgsConstructor
public enum PetErrorCode {

    PET_NOT_FOUND(HttpStatus.NOT_FOUND, "PET-404", "해당 동물을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}