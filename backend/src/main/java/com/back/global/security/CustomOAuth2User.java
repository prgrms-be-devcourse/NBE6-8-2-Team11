package com.back.global.security;

import com.back.domain.member.entity.Member;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private final Member member;
    private final Map<String, Object> attributes;

    public CustomOAuth2User(Member member, Map<String, Object> attributes) {
        this.member = member;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return this.attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Member 엔티티의 getAuthorities()를 그대로 사용
        return member.getAuthorities();
    }

    @Override
    public String getName() {
        // 카카오에서 제공하는 고유 ID를 반환
        return String.valueOf(attributes.get("id"));
    }

    // 우리 서비스에서 사용자를 식별할 이메일을 반환하는 추가 메서드
    public String getEmail() {
        return member.getEmail();
    }

    public String getNickname() {
        return member.getName();
    }

    public Long getId() {
        return member.getId();
    }
}