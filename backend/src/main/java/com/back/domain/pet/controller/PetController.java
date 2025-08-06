package com.back.domain.pet.controller;

import com.back.domain.pet.dto.request.PetCreateRequestDto;
import com.back.domain.pet.dto.request.PetUpdateRequestDto;
import com.back.domain.pet.dto.response.PetInfoResponseDto;
import com.back.domain.pet.service.PetService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    @Operation(summary = "동물 생성")
    public ResponseEntity<ApiResponse<PetInfoResponseDto>> createPet(
            @RequestBody  @Valid PetCreateRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userEmail = userDetails.getUsername();
        PetInfoResponseDto createdPet = petService.createPet(dto, userEmail);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(createdPet));
    }

    @DeleteMapping("/{petId}")
    @Operation(summary = "동물 삭제")
    public ResponseEntity<ApiResponse<Void>> deletePet(
            @PathVariable Long petId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userEmail = userDetails.getUsername();
        petService.deletePet(petId, userEmail);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("펫 삭제 성공", null));
    }

    @PutMapping("/{petId}")
    @Operation(summary = "동물 수정")
    public ResponseEntity<ApiResponse<PetInfoResponseDto>> updatePet(
            @PathVariable Long petId,
            @RequestBody @Valid PetUpdateRequestDto requestDto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userEmail = userDetails.getUsername();
        PetInfoResponseDto updated = petService.updatePet(petId, userEmail, requestDto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(updated));
    }

    @GetMapping("/{petId}")
    @Operation(summary = "동물 단건 조회")
    public ResponseEntity<ApiResponse<PetInfoResponseDto>> getPet(@PathVariable Long petId) {
        PetInfoResponseDto pet = petService.getPetById(petId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(pet));
    }

    @GetMapping
    @Operation(summary = "동물 전체 조회")
    public ResponseEntity<ApiResponse<List<PetInfoResponseDto>>> getAllPets() {
        List<PetInfoResponseDto> pets = petService.getAllPets();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(pets));
    }
}
