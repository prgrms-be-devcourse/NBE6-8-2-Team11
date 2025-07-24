package com.back.domain.pet.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;


@Getter
public class PetException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    public PetException(PetErrorCode memberErrorCode) {
        super(memberErrorCode.getMessage());
        this.httpStatus = memberErrorCode.getHttpStatus();
        this.code = memberErrorCode.getCode();
        this.message = memberErrorCode.getMessage();
    }
}