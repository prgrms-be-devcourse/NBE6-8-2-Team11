package com.back.domain.member.controller;

import com.back.domain.member.dto.request.LoginRequestDto;
import com.back.domain.member.dto.request.SignUpRequestDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.UserRole;
import com.back.domain.member.repository.MemberRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        memberRepository.deleteAll();
    }

    @Test
    @DisplayName("회원가입 성공")
    void t1() throws Exception {
        //given
        SignUpRequestDto requestDto = new SignUpRequestDto(
                "test1@test.com","password","test1", "010-1234-5678");
        //then
        mockMvc.perform(post("/api/auth/join")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.content.email").value("test1@test.com"));

    }

    @Test
    @DisplayName("로그인에 성공. JWT 토큰을 발급받는다")
    void t2() throws Exception {
        // given
        memberRepository.save(Member.builder()
                .email("test@test.com")
                .password(passwordEncoder.encode("password123"))
                .name("테스터")
                .phone("010-1234-5678")
                .role(UserRole.USER)
                .build());

        LoginRequestDto request = new LoginRequestDto("test@test.com", "password123");
        //then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.content.grantType").value("Bearer"))
                .andExpect(jsonPath("$.content.accessToken").exists());
    }


}