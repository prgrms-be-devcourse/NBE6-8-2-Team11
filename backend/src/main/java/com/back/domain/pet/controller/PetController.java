package com.back.domain.pet.controller;

import com.back.domain.pet.dto.request.PetCreateRequestDto;
import com.back.domain.pet.dto.request.PetUpdateRequestDto;
import com.back.domain.pet.dto.response.PetInfoResponseDto;
import com.back.domain.pet.service.PetService;
import com.back.global.common.ApiResponse;
import com.back.global.security.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    @Operation(summary = "동물 생성")
    public ResponseEntity<PetInfoResponseDto> createPet(
            @RequestBody PetCreateRequestDto dto,
            @AuthenticationPrincipal CustomOAuth2User principal // 또는 Principal, Authentication 사용 가능
    ) {
        String userEmail = principal.getEmail();
        PetInfoResponseDto createdPet = petService.createPet(dto, userEmail);
        return ResponseEntity.ok(createdPet);
    }

    @DeleteMapping("/{petId}")
    @Operation(summary = "동물 삭제")
    public ResponseEntity<Void> deletePet(
            @PathVariable Long petId,
            @AuthenticationPrincipal CustomOAuth2User principal
    ) {
        String userEmail = principal.getEmail();
        petService.deletePet(petId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{petId}")
    @Operation(summary = "동물 수정")
    public ResponseEntity<ApiResponse<PetInfoResponseDto>> updatePet(
            @PathVariable Long petId,
            @RequestBody @Valid PetUpdateRequestDto requestDto,
            @AuthenticationPrincipal CustomOAuth2User principal
    ) {
        String userEmail = principal.getEmail();
        PetInfoResponseDto updated = petService.updatePet(petId, userEmail, requestDto);
        return ResponseEntity.ok(ApiResponse.success("펫 수정 성공", updated));
    }


    @GetMapping("/{petId}")
    @Operation(summary = "동물 단건 조회")
    public ResponseEntity<PetInfoResponseDto> getPet(@PathVariable Long petId){
        PetInfoResponseDto pet = petService.getPetById(petId);
        return ResponseEntity.ok(pet);
    }

    @GetMapping
    @Operation(summary = "동물 전체 조회")
    public ResponseEntity<List<PetInfoResponseDto>> getAllPets() {
        List<PetInfoResponseDto> pets = petService.getAllPets();
        return ResponseEntity.ok(pets);
    }


}
