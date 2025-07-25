package com.back.domain.member.dto.request;

public record LoginRequestDto(
        String email,
        String password
) {
}
