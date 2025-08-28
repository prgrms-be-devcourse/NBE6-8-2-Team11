package com.back.global.security;

import com.back.domain.member.entity.Member;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

public class CustomAuthentication implements Authentication {
    private final Authentication authentication;
    private final Member member;

    public CustomAuthentication(Authentication authentication, Member member) {
        this.authentication = authentication;
        this.member = member;
    }

    public static CustomAuthentication from(Member member) {
        // 사용자의 이메일과 권한 정보를 바탕으로 간단한 Authentication 객체를 생성합니다.
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                member.getEmail(),
                null, //비번
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + member.getRole().name()))
        );
        return new CustomAuthentication(authentication, member);
    }

    public Member getMember() {
        return member;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authentication.getAuthorities();
    }

    @Override
    public Object getCredentials() {
        return authentication.getCredentials();
    }

    @Override
    public Object getDetails() {
        return authentication.getDetails();
    }

    @Override
    public Object getPrincipal() {
        return authentication.getPrincipal();
    }

    @Override
    public boolean isAuthenticated() {
        return authentication.isAuthenticated();
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        authentication.setAuthenticated(isAuthenticated);
    }

    @Override
    public String getName() {
        return authentication.getName();
    }
}
