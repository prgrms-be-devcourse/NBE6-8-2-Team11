package com.back.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;


// 해당 커스텀 예외처럼 패키지별로 작업하시면서 MemberErrorException 이런 식으로 작성하시면 됩니다.
// 생성자의 인자는 처리하고자 하는 커스텀 예외 코드를 사용하시면 됩니다.
@Getter
public class CustomException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.httpStatus = errorCode.getHttpStatus();
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }
}