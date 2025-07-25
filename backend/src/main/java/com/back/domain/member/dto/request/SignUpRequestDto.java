package com.back.domain.member.dto.request;

//회원가입 요청시 받을 데이터
public record SignUpRequestDto (
        String email,
        String password,
        String name,
        String phone
){}
