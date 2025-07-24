package com.back.domain.care.controller;

import com.back.domain.care.dto.request.CareRequestDto;
import com.back.domain.care.dto.response.CareResponseDto;
import com.back.domain.care.service.CareService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applies")
@RequiredArgsConstructor
public class CareController {

    private final CareService careService;

    @PostMapping("/care")
    @Operation(summary = "돌봄 신청", description = "돌봄 신청을 처리합니다.")
    public ResponseEntity<ApiResponse<CareResponseDto>> applyCare(
            @RequestBody CareRequestDto careRequestDto) {
        CareResponseDto careResponseDto = careService.applyCare(careRequestDto);

        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(careResponseDto)
        );
    }
}
