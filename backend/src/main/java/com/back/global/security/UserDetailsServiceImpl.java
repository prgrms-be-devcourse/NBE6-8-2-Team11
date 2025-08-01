package com.back.global.security;

import com.back.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Attempting to load user by email: {}", email);
        
        try {
            return memberRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.error("User not found for email: {}", email);
                        return new UsernameNotFoundException("해당 이메일을 찾을 수 없습니다: " + email);
                    });
        } catch (Exception e) {
            log.error("Error loading user by email: {}", email, e);
            throw e;
        }
    }
}