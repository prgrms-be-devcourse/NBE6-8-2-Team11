//package com.back.domain.adoption.controller;
//
//import com.back.domain.adoption.dto.request.AdoptionCareStatusUpdateRequestDto;
//import com.back.domain.adoption.dto.request.AdoptionRequestDto;
//import com.back.domain.adoption.dto.response.AdoptionResponseDto;
//import com.back.domain.adoption.dto.response.ApplicationResponseDto;
//import com.back.domain.adoption.dto.response.ApplicationSimpleListResponseDto;
//import com.back.domain.adoption.entity.Adoption;
//import com.back.domain.adoption.enums.RequestStatus;
//import com.back.domain.adoption.repository.AdoptionRepository;
//import com.back.domain.adoption.service.AdoptionService;
//import com.back.domain.care.entity.Care;
//import com.back.domain.care.repository.CareRepository;
//import com.back.domain.member.entity.Member;
//import com.back.domain.member.enums.UserRole;
//import com.back.domain.member.repository.MemberRepository;
//import com.back.domain.pet.entity.Pet;
//import com.back.domain.pet.entity.PetStatus;
//import com.back.domain.pet.enums.Gender;
//import com.back.domain.pet.enums.PetStatusType;
//import com.back.domain.pet.repository.PetRepository;
//import com.back.domain.pet.repository.PetStatusRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import java.util.ArrayList;
//import java.util.List;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.context.WebApplicationContext;
//
//import java.time.LocalDateTime;
//
//import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@SpringBootTest
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//@ActiveProfiles("test")
//@Transactional
//class AdoptionControllerIntegrationTest {
//
//    @Autowired
//    private WebApplicationContext context;
//
//    @Autowired
//    private MemberRepository memberRepository;
//
//    @Autowired
//    private PetRepository petRepository;
//
//    @Autowired
//    private PetStatusRepository petStatusRepository;
//
//    @Autowired
//    private AdoptionRepository adoptionRepository;
//
//    @Autowired
//    private CareRepository careRepository;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private MockMvc mockMvc;
//    private Member testMember;
//    private Member petOwner;
//    private Pet testPet;
//    private Adoption testAdoption;
//    private Care testCare;
//
//    @BeforeEach
//    void setUp() {
//        mockMvc = MockMvcBuilders
//                .webAppContextSetup(context)
//                .apply(springSecurity())
//                .build();
//
//        // 테스트 회원 생성 (신청자)
//        testMember = Member.builder()
//                .email("test@example.com")
//                .name("테스트회원")
//                .password("password123")
//                .phone("010-1234-5678")
//                .role(UserRole.USER)
//                .build();
//        memberRepository.save(testMember);
//
//        // 펫 소유자 생성
//        petOwner = Member.builder()
//                .email("owner@example.com")
//                .name("펫소유자")
//                .password("password123")
//                .phone("010-8765-4321")
//                .role(UserRole.USER)
//                .build();
//        memberRepository.save(petOwner);
//
//        // 테스트 펫 생성
//        testPet = Pet.builder()
//                .name("테스트펫")
//                .species("강아지")
//                .age(3)
//                .gender(Gender.MALE)
//                .description("친근한 강아지입니다.")
//                .member(petOwner)
//                .petStatuses(new ArrayList<>())
//                .build();
//        petRepository.save(testPet);
//
//        // 펫 상태 설정 (입양 가능)
//        PetStatus petStatus = PetStatus.builder()
//                .pet(testPet)
//                .status(PetStatusType.AVAILABLE_FOR_ADOPTION)
//                .build();
//        petStatusRepository.save(petStatus);
//
//        // Pet 엔티티의 petStatuses 리스트에 추가
//        testPet.getPetStatuses().add(petStatus);
//
//        // 테스트 입양 신청 생성 (petOwner가 소유한 펫에 대한 신청)
//        testAdoption = Adoption.builder()
//                .member(testMember)  // testMember가 신청자
//                .pet(testPet)        // testPet은 petOwner가 소유
//                .title("입양 신청합니다")
//                .message("정성스럽게 키우겠습니다.")
//                .status(RequestStatus.PENDING)
//                .build();
//        adoptionRepository.save(testAdoption);
//
//        // 테스트 돌봄 신청 생성
//        testCare = Care.builder()
//                .member(testMember)
//                .pet(testPet)
//                .title("돌봄 신청합니다")
//                .message("정성스럽게 돌봐드리겠습니다.")
//                .desiredStartDate(LocalDateTime.now().plusDays(1))
//                .desiredEndDate(LocalDateTime.now().plusDays(7))
//                .status(RequestStatus.PENDING)
//                .build();
//        careRepository.save(testCare);
//    }
//
//    @Test
//    @DisplayName("입양 신청 - 성공")
//    @WithMockUser(username = "test@example.com", roles = {"USER"})
//    void applyAdoption_Success() throws Exception {
//        // given
//        AdoptionRequestDto requestDto = new AdoptionRequestDto(
//                testPet.getId(),
//                "입양 신청합니다",
//                "강아지 1마리",
//                "돌봄 경험이 있습니다.",
//                "정성스럽게 키우겠습니다."
//        );
//
//        // when & then
//        mockMvc.perform(post("/api/applies/adoption")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestDto)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.content.title").value("입양 신청합니다"))
//                .andExpect(jsonPath("$.content.message").value("정성스럽게 키우겠습니다."));
//    }
//
//    @Test
//    @DisplayName("입양 신청 - 존재하지 않는 펫")
//    @WithMockUser(username = "test@example.com", roles = {"USER"})
//    void applyAdoption_PetNotFound() throws Exception {
//        // given
//        AdoptionRequestDto requestDto = new AdoptionRequestDto(
//                999L,
//                "입양 신청합니다",
//                "강아지 1마리",
//                "돌봄 경험이 있습니다.",
//                "정성스럽게 키우겠습니다."
//        );
//
//        // when & then
//        mockMvc.perform(post("/api/applies/adoption")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestDto)))
//                .andExpect(status().isNotFound());
//    }
//
//    @Test
//    @DisplayName("입양 신청 - 입양 불가능한 펫")
//    @WithMockUser(username = "test@example.com", roles = {"USER"})
//    void applyAdoption_PetNotAvailableForAdoption() throws Exception {
//        // given - 펫 상태를 입양 불가능으로 변경
//        List<PetStatus> petStatuses = petStatusRepository.findByPet(testPet);
//        petStatuses.stream()
//                .filter(petStatus -> petStatus.getStatus() == PetStatusType.AVAILABLE_FOR_ADOPTION)
//                .forEach(petStatus -> {
//                    petStatus.updateStatus(PetStatusType.ADOPTED);
//                    petStatusRepository.save(petStatus);
//                });
//
//        AdoptionRequestDto requestDto = new AdoptionRequestDto(
//                testPet.getId(),
//                "입양 신청합니다",
//                "강아지 1마리",
//                "돌봄 경험이 있습니다.",
//                "정성스럽게 키우겠습니다."
//        );
//
//        // when & then
//        mockMvc.perform(post("/api/applies/adoption")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestDto)))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    @DisplayName("회원 입양/돌봄 신청 목록 조회 - 성공")
//    @WithMockUser(username = "test@example.com", roles = {"USER"})
//    void getAdoptionAndCareList_Success() throws Exception {
//        // when & then
//        mockMvc.perform(get("/api/applies"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.content").isArray())
//                .andExpect(jsonPath("$.content.length()").value(2)); // 입양 1개 + 돌봄 1개
//    }
//
//    @Test
//    @DisplayName("회원 입양/돌봄 신청 내역 상세 조회 - 성공")
//    @WithMockUser(username = "test@example.com", roles = {"USER"})
//    void getAdoptionAndCareDetail_Success() throws Exception {
//        // when & then
//        mockMvc.perform(get("/api/applies/detail")
//                        .param("typeId", testAdoption.getId().toString())
//                        .param("type", "ADOPTION"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.content.title").value("입양 신청합니다"));
//    }
//
//    @Test
//    @DisplayName("회원 입양/돌봄 신청 내역 단건 삭제 - 성공")
//    @WithMockUser(username = "test@example.com", roles = {"USER"})
//    void deleteAdoptionAndCare_Success() throws Exception {
//        // when & then
//        mockMvc.perform(delete("/api/applies")
//                        .param("typeId", testAdoption.getId().toString())
//                        .param("type", "ADOPTION"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true));
//    }
//
//    @Test
//    @DisplayName("회원 입양/돌봄 신청 내역 전체 삭제 - 성공")
//    @WithMockUser(username = "test@example.com", roles = {"USER"})
//    void deleteAdoptionAndCareAll_Success() throws Exception {
//        // when & then
//        mockMvc.perform(delete("/api/applies/all"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true));
//    }
//
//    @Test
//    @DisplayName("보호자가 받은 입양/돌봄 신청 내역 리스트 조회 - 성공")
//    @WithMockUser(username = "owner@example.com", roles = {"USER"})
//    void getReceivedApplications_Success() throws Exception {
//        // when & then
//        mockMvc.perform(get("/api/applies/received"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.content").isArray());
//    }
//
//    @Test
//    @DisplayName("보호자가 받은 입양/돌봄 신청 내역 상세 조회 - 성공")
//    @WithMockUser(username = "owner@example.com", roles = {"USER"})
//    void getReceivedApplicationDetail_Success() throws Exception {
//        // when & then
//        mockMvc.perform(get("/api/applies/received/detail")
//                        .param("typeId", testAdoption.getId().toString())
//                        .param("type", "ADOPTION"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true))
//                .andExpect(jsonPath("$.content.title").value("입양 신청합니다"));
//    }
//
//    @Test
//    @DisplayName("보호자가 받은 입양/돌봄 신청 내역 상태 변경 - 수락")
//    @WithMockUser(username = "owner@example.com", roles = {"USER"})
//    void updateReceivedApplicationStatus_Accept() throws Exception {
//        // given
//        AdoptionCareStatusUpdateRequestDto requestDto = new AdoptionCareStatusUpdateRequestDto(
//                testAdoption.getId(),
//                "ADOPTION",
//                "ACCEPTED"
//        );
//
//        // when & then
//        mockMvc.perform(put("/api/applies/received")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestDto)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true));
//    }
//
//    @Test
//    @DisplayName("보호자가 받은 입양/돌봄 신청 내역 상태 변경 - 거절")
//    @WithMockUser(username = "owner@example.com", roles = {"USER"})
//    void updateReceivedApplicationStatus_Reject() throws Exception {
//        // given
//        AdoptionCareStatusUpdateRequestDto requestDto = new AdoptionCareStatusUpdateRequestDto(
//                testAdoption.getId(),
//                "ADOPTION",
//                "REJECTED"
//        );
//
//        // when & then
//        mockMvc.perform(put("/api/applies/received")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestDto)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true));
//    }
//
//    @Test
//    @DisplayName("보호자가 받은 입양/돌봄 등록 내역 단건 삭제 - 성공")
//    @WithMockUser(username = "owner@example.com", roles = {"USER"})
//    void deleteReceivedApplication_Success() throws Exception {
//        // when & then
//        mockMvc.perform(delete("/api/applies/received")
//                        .param("typeId", testAdoption.getId().toString())
//                        .param("type", "ADOPTION"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true));
//    }
//
//    @Test
//    @DisplayName("보호자가 받은 입양/돌봄 등록 내역 전체 삭제 - 성공")
//    @WithMockUser(username = "owner@example.com", roles = {"USER"})
//    void deleteReceivedApplicationsAll_Success() throws Exception {
//        // when & then
//        mockMvc.perform(delete("/api/applies/received/all"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.success").value(true));
//    }
//
//    @Test
//    @DisplayName("입양 신청 - 권한 없음")
//    void applyAdoption_Unauthorized() throws Exception {
//        // given
//        AdoptionRequestDto requestDto = new AdoptionRequestDto(
//                testPet.getId(),
//                "입양 신청합니다",
//                "강아지 1마리",
//                "돌봄 경험이 있습니다.",
//                "정성스럽게 키우겠습니다."
//        );
//
//        // when & then
//        mockMvc.perform(post("/api/applies/adoption")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(requestDto)))
//                .andExpect(status().isFound()); // 302 - 인증되지 않은 사용자는 OAuth2 로그인 페이지로 리다이렉트
//    }
//}