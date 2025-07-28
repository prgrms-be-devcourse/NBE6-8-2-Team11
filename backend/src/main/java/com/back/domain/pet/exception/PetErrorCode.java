package com.back.domain.pet.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;


@Getter
@AllArgsConstructor
public enum PetErrorCode {

    PET_NOT_FOUND(HttpStatus.NOT_FOUND, "PET-404", "해당 동물을 찾을 수 없습니다."),
    PET_NOT_AVAILABLE_FOR_CARE(HttpStatus.BAD_REQUEST, "PET-400", "해당 동물을 돌봄할 수 있는 상태가 아닙니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "PET-401", "해당 회원을 찾을 수 없습니다."),
    SHELTER_NOT_FOUND(HttpStatus.NOT_FOUND,"PET-402","해당 보호소를 찾을 수 없습니다."),
    MEMBER_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH-401", "회원 인증이 필요합니다."),
    MEMBER_FORBIDDEN(HttpStatus.FORBIDDEN, "AUTH-403", "권한이 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}