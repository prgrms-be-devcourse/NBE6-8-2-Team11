package com.back.global.security;

import com.back.domain.member.dto.response.TokenResponseDto;
import com.back.domain.member.entity.Member;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtProvider {

    private final Key key;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtProvider(@Value("${jwt.secret}") String secretKey,
                       @Value("${jwt.access-token-expiration}") String accessTokenExpiration,
                       @Value("${jwt.refresh-token-expiration}") String refreshTokenExpiration) {


        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);

        this.accessTokenExpiration = java.time.Duration.parse(accessTokenExpiration).toMillis();
        this.refreshTokenExpiration = java.time.Duration.parse(refreshTokenExpiration).toMillis();
    }

    // 유저 정보를 가지고 AccessToken, RefreshToken을 생성하는 메서드
    public TokenResponseDto generateToken(Authentication authentication) {
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        String email = null;
        String nickname = null;
        Long id = null;

        Object principal = authentication.getPrincipal();
        
        // CustomAuthentication인 경우 (일반 로그인)
        if (authentication instanceof CustomAuthentication) {
            CustomAuthentication customAuth = (CustomAuthentication) authentication;
            Member member = customAuth.getMember();
            email = member.getEmail();
            nickname = member.getName();
            id = member.getId();
        } else if (principal instanceof CustomOAuth2User) {
            // OAuth2 로그인인 경우
            CustomOAuth2User customOAuth2User = (CustomOAuth2User) principal;
            email = customOAuth2User.getEmail();
            nickname = customOAuth2User.getNickname();
            id = customOAuth2User.getId();
        } else if (principal instanceof UserDetails) {
            // 기본 UserDetails인 경우
            email = ((UserDetails) principal).getUsername();
        }

        long now = (new Date()).getTime();

        // Access Token 생성
        Date accessTokenExpiresIn = new Date(now + this.accessTokenExpiration);
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName()) // 이메일 또는 사용자 식별자
                .claim("auth", authorities)
                .claim("email", email)
                .claim("nickname", nickname)
                .claim("id", id)
                .setExpiration(accessTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // Refresh Token 생성
        Date refreshTokenExpiresIn = new Date(now + this.refreshTokenExpiration);
        String refreshToken = Jwts.builder()
                .setExpiration(refreshTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return TokenResponseDto.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // JWT 토큰을 복호화하여 토큰에 들어있는 정보를 꺼내는 메서드
    public Authentication getAuthentication(String accessToken) {
        Claims claims = parseClaims(accessToken);

        if (claims.get("auth") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("auth").toString().split(","))
                        .filter(auth -> auth != null && !auth.trim().isEmpty())
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        String email = (String) claims.get("email");
        // 기존 claims.getSubject()는 고유 id를 반환 -> email 로 변경
        UserDetails principal = new User(email, "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    // 토큰 정보를 검증하는 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}