package com.back.global.config;


import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.UserRole;
import com.back.domain.member.repository.MemberRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer {

    private final MemberRepository memberRepository;

    @Autowired
    public AdminInitializer(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @PostConstruct
    public void init() {
        String adminEmail = "admin@example.com";
        if (memberRepository.findByEmail(adminEmail).isEmpty()) {  // findByEmail
            Member admin = Member.builder()
                    .email(adminEmail)
                    .password("$2a$12$W9aCR.tjkvxf1ZyGNpFw2uViuoF7GyvdjC8uU6PNmgVRo4wEA8Nru")
                    .name("관리자")
                    .role(UserRole.ADMIN)
                    .build();
            memberRepository.save(admin);
            System.out.println("관리자 계정 생성 완료: " + adminEmail);
        }
    }

}
