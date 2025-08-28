package com.back.domain.member.controller;

import com.back.domain.member.dto.request.LoginRequestDto;
import com.back.domain.member.dto.request.ReissueRequestDto;
import com.back.domain.member.dto.request.SignUpRequestDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.UserRole;
import com.back.domain.member.repository.MemberRepository;
import com.fasterxml.jackson.databind.JsonNode;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private MemberRepository memberRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private Member testUser;

    @BeforeEach
    void setUp() {
        memberRepository.deleteAll();
        // 모든 테스트에서 사용할 기본 사용자를 미리 생성
        testUser = memberRepository.save(Member.builder()
                .email("test@test.com")
                .password(passwordEncoder.encode("password123"))
                .name("테스터")
                .role(UserRole.USER)
                .build());
    }

    @Test
    @DisplayName("POST /api/auth/join - 회원가입 성공")
    void signUp_Success() throws Exception {
        // given
        SignUpRequestDto requestDto = new SignUpRequestDto(
                "newuser@test.com", "password", "새사용자", "010-1234-5678");

        // when & then
        mockMvc.perform(post("/api/auth/join")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.content.email").value("newuser@test.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login - 로그인 성공 및 토큰 발급")
    void login_Success() throws Exception {
        // given
        LoginRequestDto requestDto = new LoginRequestDto("test@test.com", "password123");

        // when & then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.content.accessToken").exists())
                .andExpect(jsonPath("$.content.refreshToken").exists());
    }

    @Test
    @DisplayName("POST /api/auth/reissue - 토큰 재발급 성공")
    void reissueToken_Success() throws Exception {
        // given
        // 1. 로그인하여 Refresh Token을 DB에 저장하고, 응답에서 받아온다.
        LoginRequestDto loginDto = new LoginRequestDto("test@test.com", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andReturn();

        String responseString = loginResult.getResponse().getContentAsString();
        JsonNode responseJson = objectMapper.readTree(responseString);
        String refreshToken = responseJson.get("content").get("refreshToken").asText();

        // 2. 재발급 요청 DTO를 생성한다.
        ReissueRequestDto reissueDto = new ReissueRequestDto(refreshToken);

        // when & then
        mockMvc.perform(post("/api/auth/reissue")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reissueDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("토큰이 재발급 됐습니다."))
                .andExpect(jsonPath("$.content.accessToken").exists());
    }

    @Test
    @DisplayName("DELETE /api/auth/{memberId} - 회원 탈퇴 성공")
    void deleteMember_Success() throws Exception {
        // given
        // 1. 로그인하여 Access Token을 얻는다.
        LoginRequestDto loginDto = new LoginRequestDto("test@test.com", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andReturn();
        String responseString = loginResult.getResponse().getContentAsString();
        JsonNode responseJson = objectMapper.readTree(responseString);
        String accessToken = responseJson.get("content").get("accessToken").asText();

        // when & then
        mockMvc.perform(delete("/api/auth/{memberId}", testUser.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("회원 탈퇴가 완료되었습니다."));

        // DB에서 실제로 삭제되었는지 확인
        boolean isPresent = memberRepository.findById(testUser.getId()).isPresent();
        assertThat(isPresent).isFalse();
    }
}