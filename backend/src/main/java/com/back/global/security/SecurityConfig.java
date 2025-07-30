package com.back.global.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // HttpMethod를 사용하기 위해 import
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF, 세션 관리 비활성화
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // H2 콘솔 사용을 위한 설정
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                )

                // API 경로별 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 인증 없이 접근해야 하는 공통 경로들
                        .requestMatchers(
                                "/",
                                "/favicon.ico",
                                "/h2-console/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/api/auth/**", // 회원가입, 로그인 등
                                "/ws-chat/**",
                                "/ws-notification",// WebSocket 엔드포인트
                                "/login/oauth2/code/**",
                                "/oauth2/**",
                                "/actuator/health", // Docker 헬스체크
                                "/health",
                                "/ping"
                        ).permitAll()

                        // 동물(Pet) 관련 API는 GET(조회) 요청만 모두에게 허용
                        .requestMatchers(HttpMethod.GET, "/api/pets/**").permitAll()

                        // 관리자 전용 경로
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 위에서 설정한 경로 외 나머지 모든 경로는 인증 요구
                        .anyRequest().authenticated()
                )
                //카카오톡 oauth2설정
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                )
                // JWT 필터를 기본 인증 필터 앞에 추가
                .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 오리진 설정
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:8080",
                "https://*.vercel.app",
                "https://vercel.app",
                "http://localhost:3001",
                "http://localhost:3002"
        ));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // 허용할 헤더
        configuration.setAllowedHeaders(List.of("*"));
        // 자격 증명(쿠키 등) 허용
        configuration.setAllowCredentials(true);
        // preflight 요청 캐시 시간 (초)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
        return source;
    }
}