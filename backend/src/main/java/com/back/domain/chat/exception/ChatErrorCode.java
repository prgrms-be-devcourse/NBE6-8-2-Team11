package com.back.domain.chat.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;


@Getter
@AllArgsConstructor
public enum ChatErrorCode {

    MEMBER_NOT_CHAT_ROOM_MEMBER(HttpStatus.NOT_FOUND, "CHAT-404", "채탕방 내에서 회원을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}