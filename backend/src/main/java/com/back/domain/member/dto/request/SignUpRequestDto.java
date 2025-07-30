package com.back.domain.member.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

//회원가입 요청시 받을 데이터
public record SignUpRequestDto (

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        String email,

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        @Size(min = 6, message = "비밀번호는 최소 6자 이상이어야 합니다.")
        String password,

        @NotBlank(message = "이름은 필수 입력 값입니다.")
        String name,

        String phone
){}
