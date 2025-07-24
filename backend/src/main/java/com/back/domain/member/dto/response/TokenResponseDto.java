package com.back.domain.member.dto.response;

import lombok.Builder;

@Builder
public record TokenResponseDto(
        String grantType,
        String accessToken,
        String refreshToken
) {}