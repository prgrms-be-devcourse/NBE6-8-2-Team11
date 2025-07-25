package com.back.domain.member.controller;

import com.back.domain.member.dto.response.MemberResponseDto;
import com.back.domain.member.service.AdminService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/members")
    @Operation(summary = "전체 회원 목록 조회")
    public ResponseEntity<ApiResponse<List<MemberResponseDto>>> getAllMembers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllMembers()));
    }

    @GetMapping("/members/{memberId}")
    @Operation(summary = "특정 회원 정보 조회")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getMember(memberId)));
    }

    @DeleteMapping("/members/{memberId}")
    @Operation(summary = "특정 회원 삭제 및강제 탈퇴")
    public ResponseEntity<ApiResponse<Void>> deleteMember(@PathVariable Long memberId) {
        adminService.deleteMember(memberId);
        return ResponseEntity.ok(ApiResponse.success("해당 회원을 삭제했습니다.", null));
    }


}