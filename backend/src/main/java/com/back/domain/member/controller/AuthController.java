package com.back.domain.member.controller;


import com.back.domain.member.dto.request.LoginRequestDto;
import com.back.domain.member.dto.request.SignUpRequestDto;
import com.back.domain.member.dto.response.MemberResponseDto;
import com.back.domain.member.dto.response.TokenResponseDto;
import com.back.domain.member.service.AuthService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "회원가입", description = "새로운 회원을 등록합니다")
    @PostMapping("/join")
    public ResponseEntity<ApiResponse<MemberResponseDto>> signUp(@Valid @RequestBody SignUpRequestDto requestDto) {
        MemberResponseDto responseDto = authService.signUp(requestDto);
        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }
    @PostMapping("/login")
    @Operation(summary = "로그인")
    public ResponseEntity<ApiResponse<TokenResponseDto>> login(@RequestBody LoginRequestDto requestDto) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(requestDto)));
    }

    @DeleteMapping("/{memberId}")
    @Operation(summary = "회원 탈퇴")
    public ResponseEntity<ApiResponse<Void>> deleteMember(@PathVariable Long memberId, @AuthenticationPrincipal UserDetails userDetails) {
        authService.deleteMember(memberId, userDetails);
        return ResponseEntity.ok(ApiResponse.success("회원 탈퇴가 완료되었습니다.", null));
    }
}
