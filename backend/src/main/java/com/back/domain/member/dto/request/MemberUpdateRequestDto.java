package com.back.domain.member.dto.request;

public record MemberUpdateRequestDto(
        String name,
        String phone,
        String currentPassword,
        String newPassword
) {}