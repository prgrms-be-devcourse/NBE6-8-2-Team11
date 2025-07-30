package com.back.domain.adoption.controller;

import com.back.domain.adoption.dto.request.AdoptionCareStatusUpdateRequestDto;
import com.back.domain.adoption.dto.request.AdoptionRequestDto;
import com.back.domain.adoption.dto.response.AdoptionResponseDto;
import com.back.domain.adoption.dto.response.ApplicationResponseDto;
import com.back.domain.adoption.dto.response.ApplicationSimpleListResponseDto;
import com.back.domain.adoption.service.AdoptionService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/applies")
@RequiredArgsConstructor
public class AdoptionController {

    private final AdoptionService adoptionService;

    @PostMapping("/adoption")
    @Operation(summary = "입양 신청", description = "입양 신청을 처리합니다.")
    public ResponseEntity<ApiResponse<AdoptionResponseDto>> applyAdoption(
            @RequestBody AdoptionRequestDto adoptionRequestDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        AdoptionResponseDto adoptionResponseDto = adoptionService.applyAdoption(adoptionRequestDto, userDetails.getUsername());
        // 알람은 추후 구현
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(adoptionResponseDto)
        );
    }

    @GetMapping
    @Operation(summary = "회원 입양/돌봄 신청 목록 조회", description = "회원의 입양 및 돌봄 신청 목록을 조회합니다.")
    public ResponseEntity<ApiResponse<List<ApplicationSimpleListResponseDto>>> getAdoptionAndCareList(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ApplicationSimpleListResponseDto> simpleApplications
                = adoptionService.getMemberApplications(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(simpleApplications)
        );
    }

    @GetMapping("/detail")
    @Operation(summary = "회원 입양/돌봄 신청 내역 상세 조회", description = "회원의 입양 및 돌봄 신청 내역을 상세 조회합니다.")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> getAdoptionAndCareDetail(
            @RequestParam Long typeId, @RequestParam String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        ApplicationResponseDto applicationDetails
                = adoptionService.getApplicationDetails(typeId, type, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(applicationDetails)
        );
    }

    @DeleteMapping
    @Operation(summary = "회원 입양/돌봄 신청 내역 단건 취소(삭제)", description = "회원의 입양 및 돌봄 신청 내역 하나를 취소합니다.")
    public ResponseEntity<ApiResponse<Void>> deleteAdoptionAndCare(
            @RequestParam Long typeId, @RequestParam String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        adoptionService.deleteSingleHistory(typeId, type, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(null)
        );
    }

    @DeleteMapping("/all")
    @Operation(summary = "회원 입양/돌봄 신청 내역 전체 취소(삭제)", description = "회원의 입양 및 돌봄 신청 내역 전체를 취소합니다.")
    public ResponseEntity<ApiResponse<Void>> deleteAdoptionAndCareAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        adoptionService.deleteAllHistory(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(null)
        );
    }

    @GetMapping("/received")
    @Operation(summary = "보호자가 받은 입양/돌봄 신청 내역 리스트 조회", description = "보호자가 받은 입양 및 돌봄 신청 내역 리스트를 조회합니다.")
    public ResponseEntity<ApiResponse<List<ApplicationSimpleListResponseDto>>> getReceivedApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ApplicationSimpleListResponseDto> receivedApplications
                = adoptionService.getReceivedApplications(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(receivedApplications)
        );
    }

    @GetMapping("/received/detail")
    @Operation(summary = "보호자가 받은 입양/돌봄 신청 내역 상세 조회", description = "보호자가 받은 입양 및 돌봄 신청 내역을 상세 조회합니다.")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> getReceivedApplicationDetail(
            @RequestParam Long typeId, @RequestParam String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        ApplicationResponseDto applicationDetails
                = adoptionService.getReceivedApplicationDetails(typeId, type, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(applicationDetails)
        );
    }

    @PutMapping("/received")
    @Operation(summary = "보호자가 받은 입양/돌봄 신청 내역 상태 변경 - 수락/거절(ACCEPTED/REJECTED)",
            description = "보호자가 받은 입양 및 돌봄 신청 내역의 상태를 변경(수락/거절)합니다.")
    public ResponseEntity<ApiResponse<Void>> updateReceivedApplicationStatus(
            @RequestBody AdoptionCareStatusUpdateRequestDto requestDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        adoptionService.updateReceivedApplicationStatus(requestDto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(null)
        );
    }

    @DeleteMapping("/received/all")
    @Operation(summary = "보호자가 받은 입양/돌봄 등록 내역 단건 취소(삭제)",
            description = "보호자가 받은 입양 및 돌봄 등록 내역 하나를 취소합니다.")
    public ResponseEntity<ApiResponse<Void>> deleteReceivedApplication(
            @RequestParam Long typeId, @RequestParam String type,
            @AuthenticationPrincipal UserDetails userDetails) {
        adoptionService.deleteReceivedSingleHistory(typeId, type, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(null)
        );
    }

    @DeleteMapping("/received")
    @Operation(summary = "보호자가 받은 입양/돌봄 등록 내역 전체 취소(삭제)",
            description = "보호자가 받은 입양 및 돌봄 등록 내역 전체를 취소합니다.")
    public ResponseEntity<ApiResponse<Void>> deleteReceivedApplicationsAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        adoptionService.deleteOwnerAllHistory(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(null)
        );
    }

}
