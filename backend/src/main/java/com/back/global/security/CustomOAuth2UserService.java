package com.back.global.security;

import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.UserRole;
import com.back.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 카카오에서 받아온 사용자 정보
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        String email = (String) kakaoAccount.get("email");

        // DB에 해당 이메일의 사용자가 있는지 확인
        Optional<Member> optionalMember = memberRepository.findByEmail(email);

        Member member;
        if (optionalMember.isPresent()) {
            // 이미 가입된 회원이면 그대로 반환
            member = optionalMember.get();
        } else {
            // 가입되지 않은 회원이면, 새로 회원 정보를 만들어서 DB에 저장 (자동 회원가입)
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            String nickname = (String) profile.get("nickname");

            member = Member.builder()
                    .email(email)
                    .name(nickname)
                    .password("OAUTH2_USER_PASSWORD")
                    .role(UserRole.USER)
                    .build();
            memberRepository.save(member);
        }
        return new CustomOAuth2User(member, attributes);
    }
}