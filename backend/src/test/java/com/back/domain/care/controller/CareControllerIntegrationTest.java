package com.back.domain.care.controller;

import com.back.domain.care.dto.request.CareRequestDto;
import com.back.domain.care.dto.response.CareResponseDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.UserRole;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.pet.entity.Pet;
import com.back.domain.pet.entity.PetStatus;
import com.back.domain.pet.enums.Gender;
import com.back.domain.pet.enums.PetStatusType;
import com.back.domain.pet.repository.PetRepository;
import com.back.domain.pet.repository.PetStatusRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Transactional
class CareControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PetStatusRepository petStatusRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private Member testMember;
    private Pet testPet;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // 테스트 회원 생성
        testMember = Member.builder()
                .email("test@example.com")
                .name("테스트회원")
                .password("password123")
                .phone("010-1234-5678")
                .role(UserRole.USER)
                .build();
        memberRepository.save(testMember);

        // 테스트 펫 생성
        testPet = Pet.builder()
                .name("테스트펫")
                .species("강아지")
                .age(3)
                .gender(Gender.MALE)
                .description("친근한 강아지입니다.")
                .member(testMember)
                .petStatuses(new ArrayList<>())
                .build();
        petRepository.save(testPet);

        // 펫 상태 설정 (돌봄 가능)
        PetStatus petStatus = PetStatus.builder()
                .pet(testPet)
                .status(PetStatusType.AVAILABLE_FOR_CARE)
                .build();
        petStatusRepository.save(petStatus);
        
        // Pet 엔티티의 petStatuses 리스트에 추가
        testPet.getPetStatuses().add(petStatus);
    }

    @Test
    @DisplayName("돌봄 신청 - 성공")
    @WithMockUser(username = "test@example.com", roles = {"USER"})
    void applyCare_Success() throws Exception {
        // given
        CareRequestDto requestDto = CareRequestDto.builder()
                .petId(testPet.getId())
                .title("돌봄 신청합니다")
                .message("정성스럽게 돌봐드리겠습니다.")
                .desiredStartDate(LocalDateTime.now().plusDays(1))
                .desiredEndDate(LocalDateTime.now().plusDays(7))
                .build();

        // when & then
        mockMvc.perform(post("/api/applies/care")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("돌봄 신청 - 존재하지 않는 펫")
    @WithMockUser(username = "test@example.com", roles = {"USER"})
    void applyCare_PetNotFound() throws Exception {
        // given
        CareRequestDto requestDto = CareRequestDto.builder()
                .petId(999L)
                .title("돌봄 신청합니다")
                .message("정성스럽게 돌봐드리겠습니다.")
                .desiredStartDate(LocalDateTime.now().plusDays(1))
                .desiredEndDate(LocalDateTime.now().plusDays(7))
                .build();

        // when & then
        mockMvc.perform(post("/api/applies/care")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("돌봄 신청 - 돌봄 불가능한 펫")
    @WithMockUser(username = "test@example.com", roles = {"USER"})
    void applyCare_PetNotAvailableForCare() throws Exception {
        // given - 펫 상태를 돌봄 불가능으로 변경
        List<PetStatus> petStatuses = petStatusRepository.findByPet(testPet);
        petStatuses.stream()
                .filter(petStatus -> petStatus.getStatus() == PetStatusType.AVAILABLE_FOR_CARE)
                .forEach(petStatus -> {
                    petStatus.updateStatus(PetStatusType.CARE_COMPLETED);
                    petStatusRepository.save(petStatus);
                });

        CareRequestDto requestDto = CareRequestDto.builder()
                .petId(testPet.getId())
                .title("돌봄 신청합니다")
                .message("정성스럽게 돌봐드리겠습니다.")
                .desiredStartDate(LocalDateTime.now().plusDays(1))
                .desiredEndDate(LocalDateTime.now().plusDays(7))
                .build();

        // when & then
        mockMvc.perform(post("/api/applies/care")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("돌봄 신청 - 권한 없음")
    void applyCare_Unauthorized() throws Exception {
        // given
        CareRequestDto requestDto = CareRequestDto.builder()
                .petId(testPet.getId())
                .title("돌봄 신청합니다")
                .message("정성스럽게 돌봐드리겠습니다.")
                .desiredStartDate(LocalDateTime.now().plusDays(1))
                .desiredEndDate(LocalDateTime.now().plusDays(7))
                .build();

        // when & then
        mockMvc.perform(post("/api/applies/care")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isFound()); // 302 - Spring Security에서 인증되지 않은 요청은 302로 리다이렉트
    }
} 