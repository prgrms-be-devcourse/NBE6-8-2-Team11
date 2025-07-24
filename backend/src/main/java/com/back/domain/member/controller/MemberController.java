package com.back.domain.member.controller;

import com.back.domain.member.dto.request.MemberUpdateRequestDto;
import com.back.domain.member.dto.response.MemberResponseDto;
import com.back.domain.member.service.MemberService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @GetMapping("/{memberId}")
    @Operation(summary = "회원 정보 조회")
    public ResponseEntity<ApiResponse<MemberResponseDto>> getMemberInfo(@PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.success(memberService.getMemberInfo(memberId)));
    }

    @PutMapping("/{memberId}")
    @Operation(summary = "회원 정보 수정")
    public ResponseEntity<ApiResponse<MemberResponseDto>> updateMemberInfo(
            @PathVariable Long memberId,
            @RequestBody MemberUpdateRequestDto requestDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("회원 정보가 수정되었습니다.", memberService.updateMemberInfo(memberId, requestDto, userDetails)));
    }

}

