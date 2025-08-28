package com.back.domain.member.service;

import com.back.domain.member.dto.request.LoginRequestDto;
import com.back.domain.member.dto.request.SignUpRequestDto;
import com.back.domain.member.dto.response.MemberResponseDto;
import com.back.domain.member.dto.response.TokenResponseDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.UserRole;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.global.security.CustomAuthentication;
import com.back.global.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtProvider jwtProvider;

    public MemberResponseDto signUp(SignUpRequestDto requestDto) {
        if (memberRepository.findByEmail(requestDto.email()).isPresent()) {
            throw new MemberException(MemberErrorCode.EMAIL_ALREADY_EXISTS);
        }

        String encodedPassword = passwordEncoder.encode(requestDto.password());
        Member newMember = Member.builder()
                .email(requestDto.email())
                .password(encodedPassword)
                .name(requestDto.name())
                .phone(requestDto.phone())
                .role(UserRole.USER)
                .build();

        return MemberResponseDto.from(memberRepository.save(newMember));
    }

    public TokenResponseDto login(LoginRequestDto requestDto) {
        Member member = memberRepository.findByEmail(requestDto.email())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 인증 토큰 생성
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(requestDto.email(), requestDto.password());
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 사용자 정보가 포함된 커스텀 Authentication 생성
        CustomAuthentication customAuth = new CustomAuthentication(authentication, member);

        // 토큰 생성 (Member 정보 포함)
        TokenResponseDto tokenResponse = jwtProvider.generateToken(customAuth);

        //refresh토큰 db에 저장
        member.updateRefreshToken(tokenResponse.refreshToken());
        memberRepository.save(member);

        // 사용자 정보 포함하여 반환
        return TokenResponseDto.builder()
                .grantType(tokenResponse.grantType())
                .accessToken(tokenResponse.accessToken())
                .refreshToken(tokenResponse.refreshToken())
                .userId(member.getId())
                .userEmail(member.getEmail())
                .userName(member.getName())
                .build();
    }
    @Transactional
    public TokenResponseDto reissueToken(String refreshToken) {
        // 1. Refresh Token 유효성 검증
        if (!jwtProvider.validateToken(refreshToken)) {
            throw new MemberException(MemberErrorCode.INVALID_TOKEN);
        }

        // 2. DB에서 Refresh Token으로 사용자를 찾음
        Member member = memberRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new MemberException(MemberErrorCode.TOKEN_NOT_FOUND));

        // 3. 새로운 토큰 생성
        CustomAuthentication customAuth = CustomAuthentication.from(member);
        TokenResponseDto newTokenResponse = jwtProvider.generateToken(customAuth);

        // 4. DB에 새로운 Refresh Token으로 업데이트 (Refresh Token Rotation)
        member.updateRefreshToken(newTokenResponse.refreshToken());

        // 5. 사용자 정보 포함하여 새로운 토큰 정보 반환
        return TokenResponseDto.builder()
                .grantType(newTokenResponse.grantType())
                .accessToken(newTokenResponse.accessToken())
                .refreshToken(newTokenResponse.refreshToken())
                .userId(member.getId())
                .userEmail(member.getEmail())
                .userName(member.getName())
                .build();
    }

    public void deleteMember(Long memberId, UserDetails userDetails) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
        memberRepository.delete(member);
    }
}