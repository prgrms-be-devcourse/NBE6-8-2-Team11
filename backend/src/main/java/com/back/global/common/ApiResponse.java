package com.back.global.common;

import lombok.Builder;
import lombok.Getter;


// API 응답을 표준화하기 위한 클래스
// 성공 여부, 상태 코드, 메시지, 콘텐츠를 포함
// 제네릭 타입 T를 사용하여 다양한 타입의 콘텐츠(반환 타입)를 처리할 수 있도록 함
// 사용 - ResponseEntity<ApiResponse<T>> 형태로 사용
@Builder
@Getter
public class ApiResponse<T> {
    private final boolean success;
    private final String code;
    private final String message;
    private final T content;

    private final static String SUCCESS_CODE = "200";

    // 성공 응답 생성 메서드
    public static <T> ApiResponse<T> success(T content) {
        return ApiResponse.<T>builder()
                .success(true)
                .code(SUCCESS_CODE)
                .message("Success")
                .content(content)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T content) {
        return ApiResponse.<T>builder()
                .success(true)
                .code(SUCCESS_CODE)
                .message(message)
                .content(content)
                .build();
    }

    // 실패 응답 생성 메서드
    public static <T> ApiResponse<T> fail(String code, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .code(code)
                .message(message)
                .content(null)
                .build();
    }
}
