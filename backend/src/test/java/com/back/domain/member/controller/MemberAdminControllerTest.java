package com.back.domain.member.controller;

import com.back.domain.member.dto.request.LoginRequestDto;
import com.back.domain.member.dto.response.TokenResponseDto;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class MemberAdminControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private MemberRepository memberRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private String userToken;
    private String adminToken;
    private Long userId;
    private Long adminId;

    @BeforeEach
    void setUp() throws Exception {
        memberRepository.deleteAll();

        Member user = memberRepository.save(Member.builder()
                .email("user@test.com").password(passwordEncoder.encode("password"))
                .name("일반유저").phone("010-1111-1111").role(UserRole.USER).build());

        Member admin = memberRepository.save(Member.builder()
                .email("admin@test.com").password(passwordEncoder.encode("password"))
                .name("관리자").phone("010-2222-2222").role(UserRole.ADMIN).build());

        userId = user.getId();
        adminId = admin.getId();

        userToken = getTokenViaLogin("user@test.com", "password");
        adminToken = getTokenViaLogin("admin@test.com", "password");
    }

    private String getTokenViaLogin(String email, String password) throws Exception {
        LoginRequestDto request = new LoginRequestDto(email, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()).andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        String contentJson = objectMapper.readTree(jsonResponse).get("content").toString();
        TokenResponseDto tokenDto = objectMapper.readValue(contentJson, TokenResponseDto.class);
        return "Bearer " + tokenDto.accessToken();
    }

    // ================= MemberController Test =================

    @Test
    @DisplayName("사용자 본인 정보 조회 성공")
    void getMemberInfo_success() throws Exception {
        mockMvc.perform(get("/api/members/{memberId}", userId)
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.email").value("user@test.com"));
    }

    // ================= AdminController Test =================

    @Test
    @DisplayName("관리자가 전체 회원 목록 조회 성공")
    void getAllMembers_asAdmin_success() throws Exception {
        mockMvc.perform(get("/api/admin/members")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2));
    }

    @Test
    @DisplayName("관리자가 특정 회원 정보 조회 성공")
    void getMember_asAdmin_success() throws Exception {
        mockMvc.perform(get("/api/admin/members/{memberId}", userId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.email").value("user@test.com"));
    }

    @Test
    @DisplayName("관리자가 특정 회원 강제 탈퇴 성공")
    void deleteMember_asAdmin_success() throws Exception {
        mockMvc.perform(delete("/api/admin/members/{memberId}", userId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("해당 회원을 삭제했습니다."));

        boolean isUserPresent = memberRepository.findById(userId).isPresent();
        assertThat(isUserPresent).isFalse();
    }

    @Test
    @DisplayName("일반 유저가 관리자 API 호출시 Forbidden")
    void accessAdminApi_asUser_fail() throws Exception {
        mockMvc.perform(get("/api/admin/members")
                        .header("Authorization", userToken))
                .andExpect(status().isForbidden());
    }
}