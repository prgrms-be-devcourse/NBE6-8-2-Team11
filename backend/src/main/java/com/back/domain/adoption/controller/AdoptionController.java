package com.back.domain.adoption.controller;

import com.back.domain.adoption.dto.request.AdoptionRequestDto;
import com.back.domain.adoption.dto.response.AdoptionResponseDto;
import com.back.domain.adoption.service.AdoptionService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applies")
@RequiredArgsConstructor
public class AdoptionController {

    private final AdoptionService adoptionService;

    @PostMapping("/adoption")
    @Operation(summary = "입양 신청", description = "입양 신청을 처리합니다.")
    public ResponseEntity<ApiResponse<AdoptionResponseDto>> applyAdoption(
            @RequestBody AdoptionRequestDto adoptionRequestDto) {
        AdoptionResponseDto adoptionResponseDto = adoptionService.applyAdoption(adoptionRequestDto);
        // 알람은 추후 구현
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(adoptionResponseDto)
        );
    }
}
