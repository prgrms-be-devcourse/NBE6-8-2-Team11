package com.back.domain.chat.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;


@Getter
public class ChatException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    public ChatException(ChatErrorCode chatErrorCode) {
        super(chatErrorCode.getMessage());
        this.httpStatus = chatErrorCode.getHttpStatus();
        this.code = chatErrorCode.getCode();
        this.message = chatErrorCode.getMessage();
    }
}