package com.back.domain.member.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ReissueRequestDto(
        @NotBlank(message = "Refresh Token은 필수 입력 값입니다.")
        String refreshToken
        ) {
}

