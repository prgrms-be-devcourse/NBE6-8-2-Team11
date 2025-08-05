package com.back.global.security;

import com.back.domain.member.dto.response.TokenResponseDto;
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

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomOAuth2User) {
            CustomOAuth2User customOAuth2User = (CustomOAuth2User) principal;
            email = customOAuth2User.getEmail(); // CustomOAuth2User에 getEmail() 메서드가 있으므로 사용
            // CustomOAuth2User의 member 필드에서 name (닉네임)을 가져옵니다.
            // Member 엔티티에 getName() 메서드가 닉네임을 반환한다고 가정합니다.
            // 만약 Member 엔티티의 name 필드가 닉네임이 아니라면, 해당 필드명으로 수정해야 합니다.
            nickname = customOAuth2User.getNickname(); // Member 엔티티의 name 필드가 닉네임이라고 가정
        } else if (principal instanceof UserDetails) {
            // 자체 로그인 등의 경우 UserDetails에서 정보를 가져올 수 있습니다.
            // 여기서는 OAuth2User 케이스에 집중합니다.
            email = ((UserDetails) principal).getUsername(); // UserDetails의 username은 보통 이메일입니다.
            // 닉네임은 UserDetails에 직접 포함되지 않을 수 있으므로, 별도 처리가 필요합니다.
        }

        long now = (new Date()).getTime();

        // Access Token 생성
        Date accessTokenExpiresIn = new Date(now + this.accessTokenExpiration);
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName())
                .claim("auth", authorities)
                .claim("email", email)
                .claim("nickname", nickname)
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
                .refreshToken(refreshToken) // RefreshToken 추가
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