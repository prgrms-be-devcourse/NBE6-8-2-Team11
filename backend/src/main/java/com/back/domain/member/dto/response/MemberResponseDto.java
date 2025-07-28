package com.back.domain.member.dto.response;

import com.back.domain.member.entity.Member;
import lombok.Builder;

//회원가입 성공하고 줄 데이터

@Builder
public record MemberResponseDto(
        Long memberId,
        String email,
        String name,
        String phone
        ) {

    public static MemberResponseDto from(Member member) {
        return MemberResponseDto.builder()
                .memberId(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .build();
    }
}
