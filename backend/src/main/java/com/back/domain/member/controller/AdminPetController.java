package com.back.domain.member.controller;

import com.back.domain.pet.dto.request.PetCreateRequestDto;
import com.back.domain.pet.dto.request.PetUpdateRequestDto;
import com.back.domain.pet.dto.response.PetInfoResponseDto;
import com.back.domain.member.service.AdminPetService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pets")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminPetController {

    private final AdminPetService adminPetService;

    @PostMapping
    @Operation(summary = "관리자 펫 등록", description = "관리자가 새로운 펫을 등록합니다.")
    public ResponseEntity<ApiResponse<PetInfoResponseDto>> createPet(@Valid @RequestBody PetCreateRequestDto requestDto) {
        PetInfoResponseDto createdPet = adminPetService.createPet(requestDto);
        return ResponseEntity.ok(ApiResponse.success("동물이 성공적으로 등록되었습니다.", createdPet));
    }

    @GetMapping
    @Operation(summary = "관리자 펫 리스트 조회", description = "관리자가 펫의 모든 리스트를 조회합니다.")
    public ResponseEntity<ApiResponse<List<PetInfoResponseDto>>> getAllPets() {
        List<PetInfoResponseDto> allPets = adminPetService.getAllPets();
        return ResponseEntity.ok(ApiResponse.success(allPets));
    }

    @GetMapping("/{petId}")
    @Operation(summary = "관리자 특정 펫 조회", description = "관리자가 특정 펫의 상세 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<PetInfoResponseDto>> getPet(@PathVariable Long petId) {
        PetInfoResponseDto pet = adminPetService.getPetById(petId);
        return ResponseEntity.ok(ApiResponse.success(pet));
    }

    @PutMapping("/{petId}")
    @Operation(summary = "관리자 펫 정보 수정", description = "관리자가 특정 펫의 정보를 수정합니다.")
    public ResponseEntity<ApiResponse<PetInfoResponseDto>> updatePet(@PathVariable Long petId, @Valid @RequestBody PetUpdateRequestDto requestDto) {
        PetInfoResponseDto updatedPet = adminPetService.updatePet(petId, requestDto);
        return ResponseEntity.ok(ApiResponse.success("동물 정보가 수정되었습니다.", updatedPet));
    }

    @DeleteMapping("/{petId}")
    @Operation(summary = "관리자 펫 정보 삭제", description = "관리자가 특정 펫의 정보를 삭제합니다.")
    public ResponseEntity<ApiResponse<Void>> deletePet(@PathVariable Long petId) {
        adminPetService.deletePet(petId);
        return ResponseEntity.ok(ApiResponse.success("동물 정보가 삭제되었습니다.", null));
    }
}