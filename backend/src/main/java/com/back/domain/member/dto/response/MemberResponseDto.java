package com.back.domain.member.dto.response;

import com.back.domain.member.entity.Member;
import lombok.Builder;

@Builder
public record MemberResponseDto(
        Long id,
        String email,
        String name,
        String phone,
        String role
) {
    public static MemberResponseDto from(Member member) {
        return MemberResponseDto.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .role(member.getRole().name())
                .build();
    }
}
